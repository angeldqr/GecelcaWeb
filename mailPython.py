import requests

# Configuración de OAuth2
client_id = "eb6bcb9b-30a4-47be-ad16-0efae1985168"
tenant_id = "221652a5-6cb0-4abb-a8a0-2abb849d134e"
client_secret = "UsR8Q~4-goKqDlK10swt51QlTv~ljmCN4nIaRdc6"
authority = f"https://login.microsoftonline.com/{tenant_id}"
scopes = ["https://graph.microsoft.com/.default"]

# Función para obtener el token de acceso
def obtener_token_acceso():
    from msal import ConfidentialClientApplication
    app = ConfidentialClientApplication(client_id, authority=authority, client_credential=client_secret)
    result = app.acquire_token_for_client(scopes=scopes)
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception("No se pudo obtener el token de acceso.")

# Enviar correo con Microsoft Graph API
def enviar_correo(destinatario, asunto, cuerpo):
    access_token = obtener_token_acceso()
    url = "https://graph.microsoft.com/v1.0/users/eventosseguridadtic@gecelca.com.co/sendMail"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "message": {
            "subject": asunto,
            "body": {
                "contentType": "Text",
                "content": cuerpo
            },
            "toRecipients": [
                {"emailAddress": {"address": destinatario}}
            ]
        }
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 202:
        print(f"Correo enviado con éxito a {destinatario}")
    else:
        print(f"Error al enviar el correo: {response.status_code} - {response.text}")

# Ejemplo de envío
enviar_correo(
    "mquintero20@hotmail.com",
    "¡Feliz cumpleaños!",
    """
    Hola Mario Quintero,

    ¡Todo el equipo de Gecelca te desea un muy feliz cumpleaños!
    Esperamos que tengas un día lleno de alegría y felicidad.

    ¡Disfrútalo mucho!

    Atentamente,
    Gecelca.
    """
)
