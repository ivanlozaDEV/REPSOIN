from googleapiclient.discovery import build
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
from .oauth import get_credentials
from .models import Product
import urllib.parse

def send_inquiry_email(inquiry_data):
    try:
        credentials = get_credentials()
        service = build('gmail', 'v1', credentials=credentials)
        
        # Fetch product details
        product = Product.query.get(inquiry_data['product_id'])
        if not product:
            raise ValueError(f"Producto con ID {inquiry_data['product_id']} no encontrado")

        # Prepare email body for the reply button
        email_body = f"""
Hola {inquiry_data['name']},

Gracias por su interés en nuestro producto {product.name}. 

En respuesta a su consulta:

{inquiry_data['message']}

Estamos encantados de proporcionarle más información.

Saludos cordiales,
Equipo de Ventas de REPSOIN
        """
        email_body_encoded = urllib.parse.quote(email_body)

        # Create the email HTML content
        email_content = f"""
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
                body {{
                    font-family: 'Roboto', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f4f4f4;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    background-color: #1e40af;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }}
                .company-name {{
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }}
                .content {{
                    padding: 30px;
                }}
                .product-info {{
                    background-color: #f0f4f8;
                    padding: 20px;
                    margin-top: 20px;
                    border-radius: 8px;
                }}
                .product-image {{
                    max-width: 200px;
                    height: auto;
                    display: block;
                    margin: 0 auto 20px;
                    border-radius: 4px;
                }}
                .cta-button {{
                    display: inline-block;
                    background-color: #f97316;
                    color: #ffffff;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    font-weight: 700;
                    text-align: center;
                }}
                .contact-info {{
                    margin-top: 20px;
                    background-color: #e8eaf6;
                    padding: 15px;
                    border-radius: 8px;
                }}
                .contact-info a {{
                    display: inline-block;
                    margin-right: 15px;
                    text-decoration: none;
                    color: #1e40af;
                }}
                .icon {{
                    font-size: 18px;
                    margin-right: 5px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="company-name">REPSOIN</div>
                    <h1>Nueva Solicitud de Cotización Recibida</h1>
                </div>
                <div class="content">
                    <p>Se ha recibido una nueva solicitud de cotización de <strong>{inquiry_data['name']}</strong>:</p>
                    <ul>
                        <li><strong>Nombre:</strong> {inquiry_data['name']}</li>
                        <li><strong>Correo electrónico:</strong> <a href="mailto:{inquiry_data['email']}">{inquiry_data['email']}</a></li>
                        <li><strong>Ciudad:</strong> {inquiry_data['city']}</li>
                        <li><strong>Teléfono:</strong> {inquiry_data['phone']}</li>
                    </ul>
                    <div class="contact-info">
                        <a href="tel:{inquiry_data['phone']}">
                            <span class="icon">&#128222;</span>Llamar
                        </a>
                        <a href="https://wa.me/{inquiry_data['phone']}">
                            <span class="icon">&#128172;</span>WhatsApp
                        </a>
                        <a href="mailto:{inquiry_data['email']}">
                            <span class="icon">&#9993;</span>Email
                        </a>
                    </div>
                    <p><strong>Mensaje:</strong></p>
                    <p>{inquiry_data['message']}</p>
                    <div class="product-info">
                        <h2>Información del Producto</h2>
                        <img src="{product.images[0].url if product.images else '#'}" alt="{product.name}" class="product-image">
                        <p><strong>Nombre del Producto:</strong> {product.name}</p>
                        <p><strong>ID del Producto:</strong> {product.id}</p>
                    </div>
                    <a href="mailto:{inquiry_data['email']}?subject=Re: Solicitud de Cotización - {product.name}&body={email_body_encoded}" class="cta-button">Responder a la Solicitud</a>
                </div>
            </div>
        </body>
        </html>
        """
        
        message = MIMEMultipart()
        message['to'] = 'ventas@repsoin.com'
        message['from'] = 'cotizacionesweb@repsoin.com'
        message['subject'] = 'Nueva Solicitud de Cotización'
        
        message.attach(MIMEText(email_content, 'html'))
        
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        body = {'raw': raw}
        
        service.users().messages().send(userId='me', body=body).execute()
        
        print("Correo enviado exitosamente")
        return True
    except Exception as e:
        print(f"Error al enviar el correo: {str(e)}")
        return False

