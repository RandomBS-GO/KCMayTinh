import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: "user",
    });

    return NextResponse.json(
      { message: "Đăng ký thành công!", user: { id: newUser._id, name, email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi khi đăng ký:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi trong quá trình đăng ký." },
      { status: 500 }
    );
  }
}
