interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    return response.ok
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}

export function generateShoppingListEmail(
  plants: string[],
  nurseries: string[],
): { subject: string; html: string; text: string } {
  const plantList = plants.map((plant, index) => `${index + 1}. ${plant}`).join("\n")
  const nurseryList = nurseries.join(", ")

  const subject = `PowerPlant Shopping List - ${plants.length} Plants`

  const text = `Hello,

I'm interested in purchasing the following plants from my PowerPlant recommendations:

${plantList}

I'd like to check availability at: ${nurseryList}

Could you please let me know about availability and pricing?

Thank you!

Sent via PowerPlant - Smart Plant Recommendations
https://powerplant.app`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2D5A27, #F4D03F); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">PowerPlant Shopping List</h1>
        <p style="color: white; margin: 10px 0 0 0;">Smart Plant Recommendations</p>
      </div>
      
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Hello,</p>
        <p>I'm interested in purchasing the following plants from my PowerPlant recommendations:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #2D5A27; margin-top: 0;">Plant List:</h3>
          <ol style="line-height: 1.6;">
            ${plants.map((plant) => `<li>${plant}</li>`).join("")}
          </ol>
        </div>
        
        <p>I'd like to check availability at: <strong>${nurseryList}</strong></p>
        <p>Could you please let me know about availability and pricing?</p>
        <p>Thank you!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="color: #666; font-size: 14px;">
            Sent via <a href="https://powerplant.app" style="color: #2D5A27;">PowerPlant</a> - Smart Plant Recommendations
          </p>
        </div>
      </div>
    </div>
  `

  return { subject, html, text }
}
