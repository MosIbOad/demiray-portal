const nodemailer = require('nodemailer');
const config = require('./config.json');

async function sendEmail(sentUser, subject, text) {
  // Gmail SMTP sunucusu için yapılandırma
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587, // SSL için güvenli port
    secure: false, // Gmail için güvenli bağlantı 587 portunda TLS kullanır
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });

  // E-posta gönderme ayarları
  const mailOptions = {
    from: `"Demiray Portal" <${config.EMAIL_USER}>`, // gönderici adresi
    to: sentUser, // list of receivers
    subject: subject, // Subject line
    html: text, // plain text body
    // html: '<b>Merhaba Dünya</b>' // html body
  };

  // E-posta gönder
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('E-posta gönderildi: %s', info.messageId);
  });
}


function orderConfirmHTML(orderId, extraContent) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Sipariş Onayı</title>
    </head>
    <body style="text-align: center; padding: 40px 0; background: #EBF0F5;">
        <div class="card" style="background: white; padding: 60px; border-radius: 4px; box-shadow: 0 2px 3px #C8D0D8; display: inline-block; margin: 0 auto;">
            <div style="border-radius: 200px; height: 200px; width: 200px; background: #F8FAF5; margin: 0 auto;">
                <i class="checkmark" style="color: #9ABC66; font-size: 100px; line-height: 200px; margin-left:-15px;">✓</i>
            </div>
            <h1 style="color: #88B04B; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-weight: 900; font-size: 40px; margin-bottom: 10px;">Siparişiniz Onaylandı</h1>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${orderId} numaralı siparişiniz onaylandı</p>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${extraContent}</p>
        </div>
    </body>
    </html>
    `;
}

function orderCancelHTML(orderId, extraContent) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Sipariş İptali</title>
    </head>
    <body style="text-align: center; padding: 40px 0; background: #EBF0F5;">
        <div class="card" style="background: white; padding: 60px; border-radius: 4px; box-shadow: 0 2px 3px #C8D0D8; display: inline-block; margin: 0 auto;">
            <div style="border-radius: 200px; height: 200px; width: 200px; background: #faf5f5; margin: 0 auto;">
                <i class="checkmark" style="font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; color: #bc6666; font-size: 100px; line-height: 200px; margin-left:-15px;">X</i>
            </div>
            <h1 style="color: #b04b4b; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-weight: 900; font-size: 40px; margin-bottom: 10px;">Siparişiniz İptal Edildi</h1>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${orderId} numaralı siparişiniz iptal edildi</p>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${extraContent}</p>
        </div>
    </body>
    </html>`;
}

function orderWaitingHTML(orderId, extraContent) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Sipariş Beklemede</title>
    </head>
    <body style="text-align: center; padding: 40px 0; background: #EBF0F5;">
        <div class="card" style="background: white; padding: 60px; border-radius: 4px; box-shadow: 0 2px 3px #C8D0D8; display: inline-block; margin: 0 auto;">
            <div style="border-radius: 200px; height: 200px; width: 200px; background: #f5f7fa; margin: 0 auto;">
                <span class="checkmark" style="color: #6684bc; font-size: 100px; line-height: 200px;">⌛</span>
            </div>
            <h1 style="color: #4b83b0; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-weight: 900; font-size: 40px; margin-bottom: 10px;">Sipariş Bekliyor</h1>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${orderId} Numaralı Sipariş Onay Bekliyor</p>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">${extraContent}</p>
        </div>
    </body>
    </html> `;
}

function orderComingForAdminText() {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Sipariş Geldi</title>
    </head>
    <body style="text-align: center; padding: 40px 0; background: #EBF0F5;">
        <div class="card" style="background: white; padding: 60px; border-radius: 4px; box-shadow: 0 2px 3px #C8D0D8; display: inline-block; margin: 0 auto;">
            <div style="border-radius: 200px; height: 200px; width: 200px; background: #f5f7fa; margin: 0 auto;">
                <span class="checkmark" style="color: #6684bc; font-size: 100px; line-height: 200px;">⌛</span>
            </div>
            <h1 style="color: #4b83b0; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-weight: 900; font-size: 40px; margin-bottom: 10px;">Gelen Sipariş</h1>
            <p style="color: #404F5E; font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif; font-size:20px; margin: 0;">Yeni sipariş geldi paneli kontrol ediniz.</p>
        </div>
    </body>
    </html> `;
}

//console.log(orderConfirmHTML());

module.exports = { sendEmail, orderConfirmHTML, orderCancelHTML, orderWaitingHTML, orderComingForAdminText };
