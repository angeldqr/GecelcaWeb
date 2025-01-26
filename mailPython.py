import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
from datetime import datetime

# Credenciales de SendGrid
remitente = "gcelkproject@hotmail.com"  # Tu correo de Microsoft
sendgrid_user = "apikey"  # Usuario fijo de SendGrid
sendgrid_api_key = "AFXK56P66BAQ65SK8XNVW7KG"  # Reemplaza con tu API Key de SendGrid

# Configuración de la base de datos PostgreSQL
db_config = {
    "host": "localhost",
    "dbname": "Gecelca",
    "user": "postgres",
    "password": "0219"
}

# Obtener la fecha actual
hoy = datetime.now()
dia_actual = hoy.day
mes_actual = hoy.month

# Conexión a la base de datos
try:
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    # Consulta para obtener empleados que cumplen años hoy
    query = """
    SELECT primer_nombre, segundo_nombre, primer_apellido, correo_electronico
    FROM empleados
    WHERE EXTRACT(DAY FROM fecha_nacimiento) = %s
    AND EXTRACT(MONTH FROM fecha_nacimiento) = %s
    AND estado = TRUE;
    """
    cursor.execute(query, (dia_actual, mes_actual))

    # Obtener todos los empleados que cumplen años
    empleados_cumple = cursor.fetchall()  # [(primer_nombre, segundo_nombre, primer_apellido, correo_electronico), ...]

    for empleado in empleados_cumple:
        primer_nombre = empleado[0]
        segundo_nombre = empleado[1] if empleado[1] else ""
        primer_apellido = empleado[2]
        email = empleado[3]

        # Crear mensaje de felicitación
        asunto = "¡Feliz cumpleaños!"
        cuerpo = f"""
        Hola {primer_nombre} {segundo_nombre} {primer_apellido},

        ¡Todo el equipo de Gecelca te desea un muy feliz cumpleaños!
        Esperamos que tengas un día lleno de alegría y felicidad.

        ¡Disfrútalo mucho!

        Atentamente,
        Gecelca.
        """

        mensaje = MIMEMultipart()
        mensaje["From"] = remitente
        mensaje["To"] = email
        mensaje["Subject"] = asunto
        mensaje.attach(MIMEText(cuerpo, "plain"))

        try:
            # Conectar al servidor SMTP de SendGrid
            with smtplib.SMTP("smtp.sendgrid.net", 587) as server:
                server.starttls()
                server.login(sendgrid_user, sendgrid_api_key)
                server.sendmail(remitente, email, mensaje.as_string())

            print(f"Correo enviado con éxito a {primer_nombre} {primer_apellido} ({email})")
        except Exception as e:
            print(f"Error al enviar el correo a {email}: {e}")

except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
