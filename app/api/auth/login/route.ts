import { NextResponse } from "next/server";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    const expectedEmail = process.env.PREFECTURE_LOGIN_EMAIL?.trim().toLowerCase() ?? "";
    const expectedPassword = process.env.PREFECTURE_LOGIN_PASSWORD ?? "";

    if (!email || password.length === 0) {
      return NextResponse.json({ message: "Completa correo y contraseña." }, { status: 400 });
    }

    if (!expectedEmail || !expectedPassword) {
      return NextResponse.json(
        {
          message:
            "Credenciales de prefectura no configuradas. Define PREFECTURE_LOGIN_EMAIL y PREFECTURE_LOGIN_PASSWORD en el servidor.",
        },
        { status: 503 }
      );
    }

    if (email === expectedEmail && password === expectedPassword) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { message: "Credenciales incorrectas. Intenta de nuevo." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }
}
