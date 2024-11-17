import smtplib

local_hostname = 'example.com'

server = smtplib.SMTP('smtp.office365.com', 587,local_hostname=local_hostname)


try:
    server.ehlo()
    server.starttls()  # Start TLS encryption
    server.ehlo()
    server.login('tej_0906@outlook.com', '12345tejhema')

    message = 'Subject: Test\n\nThis is a test email from local development.'
    server.sendmail('tej_0906@outlook.com', 'basavannatej25@gmail.com', message)
    print("Email sent successfully!")
finally:
    server.quit()

