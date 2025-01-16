from flask.cli import FlaskGroup
from app import create_app, db  # Asegúrate de importar tu función de creación de app

app = create_app()
cli = FlaskGroup(app)

@cli.command("db")
def db_command():
    """Run database commands."""
    from flask_migrate import upgrade
    upgrade()

if __name__ == "__main__":
    cli()
