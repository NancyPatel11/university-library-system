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

    public void sendAccountApprovalMail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Bookademia Account Has Been Approved!");
            helper.setFrom("your_email@gmail.com");

            String htmlContent = """
            <html>
              <head>
                <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet" />
              </head>
              <body style="margin: 0; padding: 0;">
                <table align="center" width="100%%" cellpadding="0" cellspacing="0" border="0"
                       style="max-width: 700px; margin: auto; background: url('%s') top center / cover no-repeat, #12151F; font-family: 'IBM Plex Sans', Arial, sans-serif;">
                  <!-- Header with logo -->
                  <tr>
                    <td style="padding: 40px 30px 20px 30px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%%;">
                        <tr>
                          <td style="vertical-align: middle; width: 80px;">
                            <img src="%s"
                                 alt="Bookademia Logo" width="60" style="display: block;" />
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
            
                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 30px;">
                      <hr style="border: 0; border-top: 1px solid #2e2e2e;" />
                    </td>
                  </tr>
            
                  <!-- Body -->
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="margin-bottom: 20px; font-size: 24px; color: white; font-weight: 600;">Your Bookademia Account Has Been Approved!</h2>
            
                      <div style="color: #D6E0FF; font-size: 16px;">
                        <p style="margin: 0;">Hi %s,</p>
                        <p style="margin-top: 20px;">
                          Congratulations! Your Bookademia account has been approved. You can now browse our library, borrow books, and enjoy all the features of your new account.
                        </p>
                        <p style="margin-top: 20px;">Log in to get started:</p>
            
                        <!-- CTA Button -->
                        <a href="https://bookademia.com/login" 
                           style="display: inline-block; background-color: #f6c177; color: #000; text-decoration: none; 
                           padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 10px;">
                          Log in to Bookademia
                        </a>
            
                        <p style="margin-top: 30px;">Welcome aboard,</p>
                        <p>The Bookademia Team</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """.formatted(bgUrl, logoUrl, name);


            helper.setText(htmlContent, true); // true = HTML content
            mailSender.send(message);
        } catch (MailException | MessagingException ex) {
            System.err.println("Failed to send approval email: " + ex.getMessage());
            throw new RuntimeException("Approval email could not be sent.", ex);
        }
    }
}
