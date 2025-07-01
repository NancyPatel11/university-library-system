package com.librarymanagementsys.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Value("${bookademia.email.logo-url}")
    private String logoUrl;

    @Value("${bookademia.email.bg-url}")
    private String bgUrl;

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String to, String name, String code) {
        String subject = "Your Bookademia Verification Code";
        String greetingTitle = "Verify Your Email to Continue";

        String messageBody = """
            <p style="margin-top: 20px;">
                To verify your Bookademia account, please use the following 6-digit verification code:
            </p>
            <div style="margin: 24px 0; font-size: 24px; font-weight: bold; color: #E7C9A5;">
                %s
            </div>
            <p style="margin-top: 20px;">
                Enter this code in the verification page to complete your registration.
            </p>
        """.formatted(code);

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Thanks for joining,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, name, subject, greetingTitle, messageBody, "Verify Now", closingMessage);
    }

    public void sendWelcomeMail(String to, String name) {
        String subject = "Welcome to Bookademia, Your Reading Companion!";
        String greetingTitle = "Welcome to Bookademia!";
        String messageBody = """
            <p style="margin-top: 20px;">
                Welcome to Bookademia! We're excited to have you join our community of book enthusiasts. 
                Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.
            </p>
        """;
        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Welcome aboard,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, name, subject, greetingTitle, messageBody, "Log in to Bookademia", closingMessage);
    }

    public void sendAccountApprovalMail(String to, String name) {
        String subject = "Your Bookademia Account Has Been Approved!";
        String greetingTitle = "Your Bookademia Account Has Been Approved!";
        String messageBody = """
            <p style="margin-top: 20px;">
                Congratulations! Your Bookademia account has been approved. 
                You can now browse our library, borrow books, and enjoy all the features of your new account.
            </p>
        """;
        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Happy Reading,<br>The Bookademia Team</p>
        """;
        sendHtmlMail(to, name, subject, greetingTitle, messageBody, "Log in to Bookademia", closingMessage);
    }

    public void sendAccountRejectionMail(String to, String name) {
        String subject = "Your Bookademia Account Has Been Rejected!";
        String greetingTitle = "Your Bookademia Account Could Not Be Approved";
        String messageBody = """
            <p style="margin-top: 20px;">
                We appreciate your interest in joining Bookademia. 
                After reviewing your account request, we regret to inform you that we are unable to approve your account due to unsuccessful ID card verification.
            </p>
            <p style="margin-top: 20px;">
                If you believe this decision was made in error or have further questions, feel free to reach out to our support team.
            </p>
        """;

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Thank you for your understanding,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, name, subject, greetingTitle, messageBody, "Contact Support", closingMessage);
    }

    public void sendBorrowConfirmationMail(String to, String studentName, String bookTitle, String borrowDate, String dueDate) {
        String subject = "You've Borrowed a Book! 📚";
        String greetingTitle = "You've Borrowed a Book!";

        String messageBody = """
            <p style="margin-top: 20px;">
                You've successfully borrowed <strong>%s</strong>. Here are the details:
            </p>
            <ul style="color: #D6E0FF; font-size: 16px; line-height: 1.6; margin-top: 10px;">
                <li><strong>Borrowed On:</strong> <span style="color: #E7C9A5;">%s</span></li>
                <li><strong>Due Date:</strong> <span style="color: #E7C9A5;">%s</span></li>
            </ul>
            <p style="margin-top: 20px;">
                Enjoy your reading, and don't forget to return the book on time!
            </p>
        """.formatted(bookTitle, borrowDate, dueDate);


        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Happy reading,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, studentName, subject, greetingTitle, messageBody, "View Borrowed Books", closingMessage);
    }

    public void sendDueReminderMail(String to, String studentName, String bookTitle, String dueDate) {
        String subject = "Reminder: \"%s\" is Due Soon!".formatted(bookTitle);
        String greetingTitle = "Reminder: \"%s\" is Due Soon!".formatted(bookTitle);

        String messageBody = """
            <p style="margin-top: 20px;">
                Just a reminder that <span style="color: #E7C9A5; font-weight: bold;">%s</span> is due for return on 
                <span style="color: #E7C9A5; font-weight: bold;">%s</span>. Kindly return it on time to avoid late fees.
            </p>
            <p style="margin-top: 20px;">
                If you're still reading, you can renew the book in your account.
            </p>
        """.formatted(bookTitle, dueDate);

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Keep reading,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, studentName, subject, greetingTitle, messageBody, "Renew Book Now", closingMessage);
    }

    public void sendOverdueReminderMail(String to, String studentName, String bookTitle, String dueDate) {
        String subject = "‼️️ \"%s\" is Overdue – Return Now️".formatted(bookTitle);
        String greetingTitle = "Your Book is Overdue";

        String messageBody = """
            <p style="margin-top: 20px;">
                Our records show that <span style="color: #E7C9A5; font-weight: bold;">%s</span> was due on 
                <span style="color: #E7C9A5; font-weight: bold;">%s</span> and has not been returned yet.
            </p>
            <p style="margin-top: 20px;">
                Please return the book as soon as possible to avoid additional late fees.
            </p>
        """.formatted(bookTitle, dueDate);

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Thank you for your cooperation,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, studentName, subject, greetingTitle, messageBody, "Return Now", closingMessage);
    }


    public void sendReturnConfirmationMail(String to, String studentName, String bookTitle) {
        String subject = "Thank You for Returning \"%s\"".formatted(bookTitle);
        String greetingTitle = "Thank You for Returning \"%s\"".formatted(bookTitle);

        String messageBody = """
            <p style="margin-top: 20px;">
                We've successfully received your return of 
                <span style="color: #E7C9A5; font-weight: bold;">%s</span>. Thank you for returning it on time.
            </p>
            <p style="margin-top: 20px;">
                Looking for your next read? Browse our collection and borrow your next favorite book!
            </p>
        """.formatted(bookTitle);

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Happy exploring,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, studentName, subject, greetingTitle, messageBody, "Explore New Books", closingMessage);
    }

    public void sendLateReturnMail(String to, String studentName, String bookTitle, String dueDate, String returnDate) {
        String subject = "Book \"%s\" Returned Late".formatted(bookTitle);
        String greetingTitle = "Thanks for Returning \"%s\"".formatted(bookTitle);

        String messageBody = """
            <p style="margin-top: 20px;">
                We've received your return of 
                <span style="color: #E7C9A5; font-weight: bold;">%s</span>. However, it was returned after the due date.
            </p>
            <ul style="color: #D6E0FF; font-size: 16px; line-height: 1.6; margin-top: 10px;">
                <li><strong>Due Date:</strong> <span style="color: #E7C9A5;">%s</span></li>
                <li><strong>Returned On:</strong> <span style="color: #E7C9A5;">%s</span></li>
            </ul>
            <p style="margin-top: 20px;">
                Please try to return your books on time in the future to avoid late fees.
            </p>
            <p style="margin-top: 20px;">
                You can continue exploring and borrowing more books from our collection.
            </p>
        """.formatted(bookTitle, dueDate, returnDate);

        String closingMessage = """
            <p style="margin-top: 30px; line-height: 1.4;">Keep reading,<br>The Bookademia Team</p>
        """;

        sendHtmlMail(to, studentName, subject, greetingTitle, messageBody, "Explore New Books", closingMessage);
    }

    public void sendHtmlMail(String to, String name, String subject, String greetingTitle, String messageBody, String buttonText, String closingMessage) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("your_email@gmail.com");

            String htmlContent = getEmailTemplate(name, greetingTitle, messageBody, buttonText, closingMessage);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MailException | MessagingException ex) {
            System.err.println("Failed to send email: " + ex.getMessage());
            throw new RuntimeException("Email could not be sent.", ex);
        }
    }

    private String getEmailTemplate(String name, String greetingTitle, String messageBody, String buttonText, String closingMessage) {
        return """
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet" />
          </head>
          <body style="margin: 0; padding: 0;">
            <table align="center" width="100%%" cellpadding="0" cellspacing="0" border="0"
                   style="max-width: 700px; margin: auto; background: url('%s') top center / cover no-repeat, #12151F; font-family: 'IBM Plex Sans', Arial, sans-serif;">
              <tr>
                <td style="padding: 40px 30px 20px 30px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%%;">
                    <tr>
                      <td style="vertical-align: middle; width: 80px;">
                        <img src="%s" alt="Bookademia Logo" width="60" style="display: block;" />
                      </td>
                      <td style="vertical-align: middle; padding-left: 15px;">
                        <span style="font-size: 28px; font-weight: bold; color: white;">
                          Bookademia
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 30px;">
                  <hr style="border: 0; border-top: 1px solid #2e2e2e;" />
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <h2 style="margin-bottom: 20px; font-size: 24px; color: white; font-weight: 600;">%s</h2>
                  <div style="color: #D6E0FF; font-size: 16px;">
                    <p style="margin: 0;">Hi %s,</p>
                    %s
                    <a href="https://bookademia.com/login" 
                       style="display: inline-block; background-color: #f6c177; color: #000; text-decoration: none; 
                       padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px;">
                      %s
                    </a>
                    %s
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
        """.formatted(bgUrl, logoUrl, greetingTitle, name, messageBody, buttonText, closingMessage);
    }
}