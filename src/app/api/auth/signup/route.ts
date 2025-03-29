import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { User, UserRole } from "@/models/User";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, department, phoneNumber } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
      department,
      phoneNumber,
    };

    // For attendees, generate a unique QR code
    if (role === UserRole.ATTENDEE) {
      const attendeeId = uuidv4();
      const qrData = JSON.stringify({
        id: attendeeId,
        email,
        type: "entry",
      });
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      userData.qrCode = qrCodeDataUrl;
    }

    const user = await User.create(userData);

    // Remove sensitive data before sending response
    const sanitizedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return NextResponse.json(sanitizedUser, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 