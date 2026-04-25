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

  const foundUser = user[0];
  if (!foundUser) {
    throw new Error("Email atau password salah");
  }

  // 2. Compare password
  const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatch) {
    throw new Error("Email atau password salah");
  }

  // 3. Generate UUID token
  const token = crypto.randomUUID();

  // 4. Create session
  await db.insert(sessions).values({
    token,
    userId: foundUser.id,
  });

  return { data: token };
};

export const getCurrentUser = async (token: string) => {
  // 1. Join sessions and users to find the current user
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Unauthorized");
  }

  return { data: result[0] };
};

export const logoutUser = async (token: string) => {
  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (session.length === 0) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));

  return { data: "OK" };
};

export const updateUser = async (token: string, payload: any) => {
  const { name, password } = payload;

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (session.length === 0) {
    throw new Error("Unauthorized");
  }

  const currentSession = session[0];

  if (!currentSession || !currentSession.userId) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(users).set(updateData).where(eq(users.id, currentSession.userId));
  }

  const updatedUser = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, currentSession.userId))
    .limit(1);

  return { data: updatedUser[0] };
};
