
/// <reference path="../pb_data/types.d.ts" />
const COMPANY_ENQUIRY_EMAIL = "info@caxperts-engineering.com";

const sendEnquiryEmail = (to, subject, html, text) => {
    const senderAddress = $os.getenv("BUILDER_MAILER_SENDER_ADDRESS") || $app.settings().meta.senderAddress || "noreply@localhost";

    const mail = new MailerMessage({
        from: {
            address: senderAddress,
            name: "CAxperts Engineering",
        },
        to: [{
            address: to,
            name: "CAxperts Engineering",
        }],
        subject,
        html,
        text,
    });

    $app.newMailClient().send(mail);
};

onRecordAfterCreateSuccess((e) => {
    const record = e.record;
    const collectionName = record.collection().name;

    if (collectionName !== "enquiries") {
        return;
    }

    const name = record.get("name") || "Unknown";
    const company = record.get("company") || "Unknown company";
    const email = record.get("email") || "No email provided";
    const phone = record.get("phone") || "Not provided";
    const interest = record.get("interest") || "Not provided";
    const message = record.get("message") || "No message";

    const companyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 16px;">New enquiry submitted</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Area of interest:</strong> ${interest}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #f3f4f6; padding: 12px; border-radius: 6px;">${message}</div>
        </div>
    `;

    sendEnquiryEmail(
        COMPANY_ENQUIRY_EMAIL,
        `New enquiry from ${company}`,
        companyHtml,
        [
            `Name: ${name}`,
            `Company: ${company}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Area of interest: ${interest}`,
            "",
            "Message:",
            message,
        ].join("\n")
    );

    const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 12px;">Thanks for your enquiry</h2>
            <p>Hi ${name},</p>
            <p>Thank you for getting in touch with CAxperts Engineering. We have received your enquiry and our team will review it shortly.</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Area of interest:</strong> ${interest}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #f3f4f6; padding: 12px; border-radius: 6px;">${message}</div>
            <p>We will get back to you soon.</p>
        </div>
    `;

    sendEnquiryEmail(
        email,
        "Thanks for your enquiry — CAxperts Engineering",
        confirmationHtml,
        [
            `Hi ${name},`,
            "",
            "Thank you for getting in touch with CAxperts Engineering. We have received your enquiry and our team will review it shortly.",
            "",
            `Company: ${company}`,
            `Area of interest: ${interest}`,
            "",
            "Message:",
            message,
            "",
            "We will get back to you soon.",
        ].join("\n")
    );
});

onMailerSend((e) => {
    if (e.app.settings().smtp.enabled) {
        return e.next()
    }

    const senderAddress = $os.getenv("BUILDER_MAILER_SENDER_ADDRESS");
    const cc = (e.message.cc || []).map((recipient) => recipient.address).filter(Boolean);
    const bcc = (e.message.bcc || []).map((recipient) => recipient.address).filter(Boolean);

    const payload = {
        "subject": e.message.subject,
        "content": {
            ...(e.message.html ? {
                "html": e.message.html,
            } : {
                "text": e.message.text,
            }),
            "type": "plain",
        },
        "from": senderAddress,
        "fromName": e.message.from?.name,
        "replyTo": senderAddress,
        "to": e.message.to[0].address,
        ...(cc.length ? { "cc": cc } : {}),
        ...(bcc.length ? { "bcc": bcc } : {}),
    }

    const response = $http.send({
        url: `${$os.getenv("BUILDER_MAILER_API_URL")}/api/v2/email`,
        method: "POST",
        headers: {
            "Authorization": `Bearer ${$os.getenv("BUILDER_MAILER_API_KEY")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (response.statusCode !== 200) {
        $app.logger().error("Failed to send email", "error", response.json);

        throw new ApiError(500, response.json?.message || 'Failed to send email');
    }
})
