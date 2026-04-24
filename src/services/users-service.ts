import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // 1. Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert new user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  // 1. Find user by email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("Email atau password salah");
  }

  // 2. Compare password
  const isPasswordMatch = await bcrypt.compare(password, user[0].password);
  if (!isPasswordMatch) {
    throw new Error("Email atau password salah");
  }

  // 3. Generate UUID token
  const token = crypto.randomUUID();

  // 4. Create session
  await db.insert(sessions).values({
    token,
    userId: user[0].id,
  });

  return { data: token };
};
