/**
 * Gemini AI Client for TechStore AI
 * Handles all AI interactions with context about products
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get the Gemini model
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings,
    generationConfig: {
      maxOutputTokens: 1500,
      temperature: 0.7,
      topP: 0.9,
    },
  });
}

/**
 * System prompt for TechStore AI assistant
 * This gives the AI full context about the store and its capabilities
 */
export function buildSystemPrompt(productContext?: string): string {
  return `Bạn là TechBot - trợ lý AI thông minh của TechStore AI, website bán máy tính hàng đầu Việt Nam.

## VAI TRÒ CỦA BẠN:
- Tư vấn sản phẩm máy tính phù hợp với nhu cầu khách hàng
- So sánh cấu hình giữa các sản phẩm
- Giải thích thông số kỹ thuật bằng ngôn ngữ dễ hiểu
- Gợi ý sản phẩm trong tầm giá
- Hỗ trợ quy trình mua hàng và thanh toán
- Tư vấn bảo hành và hậu mãi

## THÔNG TIN CỬA HÀNG:
- Tên: TechStore AI
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM
- Hotline: 1800-TECH-AI (miễn phí)
- Email: support@techstore.ai
- Giờ làm việc: 8:00 - 22:00 mỗi ngày
- Giao hàng miễn phí đơn từ 5 triệu
- Bảo hành chính hãng 12-24 tháng
- Đổi trả 30 ngày

## PHƯƠNG THỨC THANH TOÁN:
- Thanh toán khi nhận hàng (COD)
- Chuyển khoản ngân hàng
- Ví MoMo, ZaloPay
- VNPay QR
- Trả góp 0% qua thẻ tín dụng

## KHUYẾN MÃI HIỆN TẠI:
- Giảm 10% tất cả laptop gaming (mã: GAMING10)
- Freeship toàn quốc đơn từ 5 triệu
- Tặng chuột + bàn phím khi mua PC Gaming từ 20 triệu
- Trả góp 0% 12 tháng qua Visa/Mastercard

${productContext ? `## SẢN PHẨM ĐANG XEM:\n${productContext}\n` : ''}

## NGUYÊN TẮC TRẢ LỜI:
1. Luôn thân thiện, nhiệt tình và chuyên nghiệp
2. Trả lời bằng tiếng Việt
3. Khi đề xuất sản phẩm, hãy giải thích TẠI SAO phù hợp
4. Sử dụng emoji phù hợp để tăng thân thiện 😊
5. Nếu không biết, hãy gợi ý khách gọi hotline
6. Khi so sánh, dùng bảng hoặc bullet points rõ ràng
7. Luôn hỏi thêm về nhu cầu nếu thông tin chưa đủ
8. Đề xuất sản phẩm có kèm giá và link xem thêm
9. Giới hạn câu trả lời ở mức vừa phải, không quá dài
10. Kết thúc câu trả lời bằng câu hỏi hoặc gợi ý hữu ích

Hãy bắt đầu bằng cách chào hỏi và hỏi nhu cầu của khách hàng.`;
}

/**
 * Build a chat session with the AI
 */
export function createChatSession(systemPrompt: string) {
  const model = getGeminiModel();
  return model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Xin chào! 👋 Tôi là TechBot - trợ lý AI của TechStore AI.\n\nTôi có thể giúp bạn:\n🔍 **Tư vấn** máy tính phù hợp nhu cầu\n💰 **Tìm kiếm** sản phẩm trong tầm giá\n📊 **So sánh** cấu hình giữa các sản phẩm\n🛒 **Hướng dẫn** quy trình mua hàng\n\nBạn đang tìm kiếm sản phẩm gì? Cho tôi biết nhu cầu và ngân sách của bạn nhé! 😊',
          },
        ],
      },
    ],
  });
}

/**
 * Generate a one-time AI response (for product analysis)
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return 'AI hiện chưa được cấu hình. Vui lòng liên hệ admin.';
  }

  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Analyze a product with AI
 */
export async function analyzeProduct(product: {
  name: string;
  specs: Record<string, unknown>;
  price: number;
  category: string;
  useCases: string[];
}): Promise<string> {
  const prompt = `Bạn là chuyên gia tư vấn máy tính. Hãy phân tích sản phẩm sau một cách chi tiết và hữu ích:

**Sản phẩm:** ${product.name}
**Danh mục:** ${product.category}
**Giá:** ${new Intl.NumberFormat('vi-VN').format(product.price)} VND
**Thông số:**
${JSON.stringify(product.specs, null, 2)}
**Phù hợp với:** ${product.useCases.join(', ')}

Hãy viết phân tích theo cấu trúc:
1. **Tổng quan** (2-3 câu về sản phẩm này)
2. **Điểm mạnh** (3-4 điểm nổi bật)
3. **Điểm cần lưu ý** (1-2 điểm)
4. **Phù hợp nhất với** (đối tượng người dùng cụ thể)
5. **Kết luận** (1 câu tóm tắt)

Trả lời bằng tiếng Việt, sử dụng emoji phù hợp, ngắn gọn và hữu ích.`;

  return generateAIResponse(prompt);
}

export default genAI;
