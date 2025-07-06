import { type NextRequest, NextResponse } from "next/server"
import { generateShoppingListEmail } from "@/lib/api/email"

export async function POST(request: NextRequest) {
  try {
    const { plants, nurseries, userEmail } = await request.json()

    if (!plants || !Array.isArray(plants) || plants.length === 0) {
      return NextResponse.json({ error: "Plants list is required" }, { status: 400 })
    }

    if (!nurseries || !Array.isArray(nurseries) || nurseries.length === 0) {
      return NextResponse.json({ error: "Nurseries list is required" }, { status: 400 })
    }

    const emailContent = generateShoppingListEmail(plants, nurseries)

    // In production, integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll simulate sending the email
    console.log("Email would be sent:", {
      to: userEmail,
      ...emailContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
