import { orderFormTemplate } from '@/lib/sendorderFormTemplate';
import connectDB from "@/lib/db";
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/order';
import Company from '@/models/Company';
import Address from '@/models/Address';

const nodemailer = require('nodemailer');

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    await Address.find();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'No data' }, { status: 400 });
    }

    const ref = body;
    const orders = await Order.findOne({ ref });
    if (!orders) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const fee = orders?.deliveryCost;
    const total = orders?.total;
    const c = orders?.createdAt;
    const date = c ? c.toISOString() : 'Unknown Date';

    const items = orders?.orderItems.map((item) => ({
      refProduct: item.refproduct,
      name: item.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
      discount: Number(item.discount),
    }));

    const company = await Company.findOne().populate('addresse');
    const namecomapny = company?.name ?? 'Unknown Company';
    const emailcompany = company?.email ?? 'Unknown Email';
    const phonecompany = typeof company?.phone === 'number' ? company.phone.toString() : company?.phone ?? 'Unknown Phone';
    const companyaddress = typeof company?.addresse === 'object' ? company?.addresse.address ?? 'Unknown Address' : 'Unknown Address';
    const companycity = typeof company?.addresse === 'object' ? company?.addresse.city ?? 'Unknown city' : 'Unknown city';
    const companygov = typeof company?.addresse === 'object' ? company?.addresse.governorate ?? 'Unknown governorate' : 'Unknown governorate';
    const companyzip = typeof company?.addresse === 'object' ? company?.addresse.zipcode ?? 'Unknown zipcode' : 'Unknown zipcode';

    const name = user.username;
    const email = user.email;

    if (!name || !email || !items) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: `${email},${process.env.EMAIL_FROM}`,
      subject: 'Your Order Confirmation',
      html: orderFormTemplate(
        name,
        email,
        items,
        ref,
        fee ?? 0,
        total ?? 0,
        date,
        namecomapny,
        emailcompany,
        phonecompany,
        companyaddress,
        companycity,
        companygov,
        companyzip
      ),
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email', error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
