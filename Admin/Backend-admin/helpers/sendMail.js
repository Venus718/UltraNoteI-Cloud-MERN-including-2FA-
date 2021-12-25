import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import { htmlToText } from "html-to-text";
import juice from "juice";

const smtp = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
const sendMail = ({
  from,
  to,
  subject,
  templateVars,
  templateName = "massMail",
}) => {
  return new Promise((resolve, reject) => {
    const templatePath = `templates/${templateName}.html`;
    const options = {
      from,
      to,
      subject,
    };
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, "utf-8");
      const html = ejs.render(template, templateVars);
      const text = htmlToText(templateVars.message);
      const htmlWithStylesInlined = juice(html);

      options.html = htmlWithStylesInlined;
      options.text = text;
    }

    resolve(smtp.sendMail(options));
  });
};

export default sendMail;
