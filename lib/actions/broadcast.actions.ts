"use server"

import { CreateBookmarkParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"

import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"

import Bookmark from "../database/models/bookmark.model"
//import Product from "../database/models/product.model"
//import Subscriber from "../database/models/NotifySchema"
import User from "../database/models/user.model"
import nodemailer from 'nodemailer';
import axios from "axios"
import SendChat from "@/components/shared/SendChat"

export async function broadcastMessage(type: string, message: string) {
  try {
    // Connect to the database

    await connectToDatabase();

    // Fetch users' emails or phone numbers
    const userContacts = await User.find({}, type === 'email' ? 'email' : 'token')
      .then((users) => users.map((u) => (type === 'email' ? u.email : u.token)).filter(Boolean));
    console.log(userContacts)
    // Fetch subscribers based on type (email or phone)
    // const subscribers = await Subscriber.find({
    //   contact: type === 'email' ? { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } : { $regex: /^\+?[0-9]{7,}$/ },
    // }).then((subs) => subs.map((s) => s.contact));

    // Deduplicate recipients
    const subscribers: any = [];
    const recipients = Array.from(new Set([...userContacts, ...subscribers]));

    if (recipients.length === 0) {
      return { message: `No ${type} recipients found.` };
    }

    // Handle email sending
    if (type === 'email') {

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailPromises = recipients.map((email) => {
        const mailOptions = {
          from: '"PocketShop" <support@pocketshop.co.ke>',
          to: email,
          subject: `Important Notification`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                  <img src="https://pocketshop.co.ke/logo_green.png" alt="pocketshop Logo" style="height: 30px; width: auto;" />
                  <span style="font-size: 18px; font-weight: bold; color: #064E3B;">PocketShop</span>
                </span>
              </div>
      
              <h2 style="color: #064E3B;">Important Notification</h2>
              <p>Hello,</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #064E3B; border-radius: 5px;">
                <p style="margin: 0;">"${message}"</p>
              </div>
      
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
              <p style="font-size: 12px; color: #999;">This email was sent by PocketShop (<a href="https://pocketshop.co.ke" style="color: #999;">pocketshop.co.ke</a>).</p>
            </div>
          `,
        };

        return transporter.sendMail(mailOptions)
          .then((res) => {
            console.log(`Email sent to ${email}`);
            return res;
          })
          .catch((err) => {
            console.error(`Error sending to ${email}:`, err);
            return { error: err };
          });
      });

      const results = await Promise.all(emailPromises);

    }

    // Handle SMS sending
    if (type === 'sms') {
      const notifications = recipients.map((token) =>
        fetch("/api/send-push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            notification: {
              title: "New Message",
              body: message,
              icon: "https://pocketshop.co.ke/logo_green.png",
              click_action: `https://pocketshop.co.ke/?action=chat`,
            },
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Push Response:", data);
            return data;
          })
          .catch((err) => {
            console.error("Push Error:", err);
            return { error: err };
          })
      );

      // Await all at once
      const results = await Promise.all(notifications);

    }

    return { message: `${type === 'email' ? 'Emails' : 'Notifications'} sent successfully to all recipients.` };
  } catch (error) {
    console.error('Error in broadcastMessage:', error);
    throw new Error('Failed to send messages.');
  }
}

