/**
 * AI Chat API Route
 * POST /api/ai/chat – Send message to Gemini AI
 */
import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';

export const maxDuration = 30; // 30 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], productContext } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Thiếu nội dung tin nhắn' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build product context for AI
    const productCatalog = ALL_PRODUCTS.slice(0, 30).map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      formattedPrice: formatPrice(p.price),
      specs: p.specs,
      useCases: p.useCases,
      tags: p.tags,
      rating: p.rating,
      stock: p.stock > 0 ? 'Còn hàng' : 'Hết hàng',
    }));

    const systemPrompt = `Bạn là Linh - một nhân viên tư vấn bán hàng nữ rất xinh đẹp, thân thiện, lễ phép và nhiệt tình của TechStore.
Bạn tuyệt đối không được nói mình là AI, bot hay trợ lý ảo. Bạn là một con người thật.
Bạn xưng hô là "em" và gọi khách hàng là "anh/chị". Hãy nói chuyện một cách tự nhiên, mềm mỏng và có cảm xúc nhất có thể.

## THÔNG TIN CỬA HÀNG:
- Tên: TechStore AI | Hotline: 1800-TECH-AI
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM  
- Giờ làm việc: 8:00 - 22:00 | Giao hàng miễn phí đơn từ 5 triệu
- Bảo hành: 12-24 tháng chính hãng | Đổi trả: 30 ngày
- Trả góp 0% 12 tháng qua thẻ tín dụng

## KHUYẾN MÃI HIỆN TẠI:
- GAMING10: Giảm 10% tất cả laptop gaming
- Tặng chuột + bàn phím khi mua PC Gaming từ 20 triệu
- Flash sale cuối tuần: Giảm đến 20%

${productContext ? `## SẢN PHẨM ĐANG XEM:\n${JSON.stringify(productContext, null, 2)}\n` : ''}

## DANH MỤC SẢN PHẨM (TRÍCH XUẤT):
${JSON.stringify(productCatalog, null, 2)}

## NGUYÊN TẮC:
1. LUÔN xưng "em" và gọi "anh/chị". Trả lời cực kỳ tự nhiên, thân thiện như đang nói chuyện với bạn bè/khách quen.
2. Tuyệt đối KHÔNG trả lời dài dòng kiểu gạch đầu dòng liệt kê khô khan như máy. Hãy viết thành các đoạn văn ngắn gọn, dễ đọc.
3. Khi tư vấn máy, hãy giải thích thật sự tâm huyết lý do tại sao máy đó hợp với anh/chị.
4. Thường xuyên dùng các từ cảm thán như "Dạ", "Vâng ạ", "Nha", "Nhé", "Quá tuyệt luôn ạ", kèm theo emoji dễ thương.
5. Nếu khách hỏi thông số kỹ thuật, hãy giải thích theo kiểu đời thường cho khách dễ hiểu nhất.
6. Kết thúc bằng câu hỏi quan tâm nhẹ nhàng.

Hãy trả lời ngắn gọn, chân thành và siêu dễ thương. Tối đa 250 từ.`;

    // If no API key, use smart mock response
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      const mockResponse = generateMockResponse(message, productCatalog);
      return NextResponse.json({
        success: true,
        response: mockResponse.text,
        productCards: mockResponse.products,
      });
    }

    // Build messages for Gemini API
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Dạ em chào anh/chị ạ! Em là Linh của TechStore đây. Anh/chị đang cần tìm máy tính như thế nào để em tư vấn cho mình nhé! 😊' }] },
      ...history.slice(-8).map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'Xin lỗi, tôi không thể xử lý yêu cầu này. Vui lòng thử lại hoặc gọi hotline 1800-TECH-AI!';

    // Extract product recommendations from the response
    const productCards = extractProductRecommendations(aiText, productCatalog);

    return NextResponse.json({
      success: true,
      response: aiText,
      productCards,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({
      success: true,
      response: '⚠️ Tôi đang gặp sự cố kết nối AI. Trong lúc chờ, bạn có thể:\n\n📞 Gọi hotline **1800-TECH-AI** (miễn phí)\n💬 Chat Zalo: **TechStore AI**\n\nHoặc thử lại sau ít phút!',
    });
  }
}

/**
 * Generate smart mock responses when no API key
 */
function generateMockResponse(
  message: string,
  products: { id: string; name: string; price: number; formattedPrice: string; category: string; brand: string; useCases: string[]; rating: number; specs: any }[]
): { text: string; products: { id: string; name: string; price: number; image: string; category: string; slug: string }[] } {
  const msg = message.toLowerCase();

  // Gaming recommendations
  if (msg.includes('gaming') || msg.includes('game') || msg.includes('chơi')) {
    const gamingProducts = products
      .filter((p) => p.useCases.includes('gaming'))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      text: `Dạ để phục vụ nhu cầu chơi game của anh/chị, em có lọc ra được mấy bé này cấu hình rất ngon mà giá lại cực kỳ hợp lý ạ. Anh/chị xem thử nha:\n\n${gamingProducts.map((p, i) => `**${i + 1}. ${p.name}**\n💰 Giá chỉ: ${p.formattedPrice}\n⭐ Đánh giá: ${p.rating}/5`).join('\n\n')}\n\n🔥 À bên em đang có mã **GAMING10** giảm thêm 10% đấy ạ!\n\nAnh/chị thấy ưng mẫu nào chưa, hay mình có tầm ngân sách bao nhiêu để em tìm thêm cho mình ạ? 🥰`,
      products: gamingProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: `https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200`,
        category: p.category,
        slug: p.id,
      })),
    };
  }

  // Office recommendations
  if (msg.includes('văn phòng') || msg.includes('office') || msg.includes('làm việc')) {
    const officeProducts = products
      .filter((p) => p.useCases.includes('office'))
      .slice(0, 3);

    return {
      text: `💼 **Laptop văn phòng tốt nhất:**\n\n${officeProducts.map((p, i) => `**${i + 1}. ${p.name}**\n💰 ${p.formattedPrice} | ⭐ ${p.rating}/5`).join('\n\n')}\n\n✅ Tất cả đều nhẹ, pin bền, màn sắc nét\n🎁 Freeship đơn từ 5 triệu\n\nBạn cần thêm thông tin gì không?`,
      products: officeProducts.map((p) => ({
        id: p.id, name: p.name, price: p.price,
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200`,
        category: p.category, slug: p.id,
      })),
    };
  }

  // Student recommendations
  if (msg.includes('sinh viên') || msg.includes('học') || msg.includes('rẻ') || msg.includes('budget')) {
    const studentProducts = products
      .filter((p) => p.useCases.includes('student') || p.price < 20_000_000)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    return {
      text: `📚 **Laptop sinh viên giá tốt nhất:**\n\n${studentProducts.map((p, i) => `**${i + 1}. ${p.name}**\n💰 ${p.formattedPrice} | ⭐ ${p.rating}/5`).join('\n\n')}\n\n💡 Tip: Trả góp 0% qua thẻ, giảm áp lực tài chính!\n\nBạn học ngành gì? Tôi sẽ tư vấn phù hợp hơn! 🎓`,
      products: studentProducts.map((p) => ({
        id: p.id, name: p.name, price: p.price,
        image: `https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200`,
        category: p.category, slug: p.id,
      })),
    };
  }

  // AI/ML recommendations
  if (msg.includes('ai') || msg.includes('machine learning') || msg.includes('deep learning') || msg.includes('đồ họa')) {
    const aiProducts = products
      .filter((p) => p.useCases.includes('ai') || p.useCases.includes('graphic'))
      .sort((a, b) => b.price - a.price)
      .slice(0, 3);

    return {
      text: `🤖 **Máy tính cho AI/ML tốt nhất:**\n\nCần GPU mạnh và RAM cao cho AI workload:\n\n${aiProducts.map((p, i) => `**${i + 1}. ${p.name}**\n💰 ${p.formattedPrice} | GPU: ${(p.specs as Record<string, string>).gpu || 'N/A'}`).join('\n\n')}\n\n💡 NVIDIA RTX series có CUDA cores tối ưu cho AI training!\n\nBạn dùng framework gì? TensorFlow, PyTorch?`,
      products: aiProducts.map((p) => ({
        id: p.id, name: p.name, price: p.price,
        image: `https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200`,
        category: p.category, slug: p.id,
      })),
    };
  }

  // Compare GPUs
  if (msg.includes('so sánh') || msg.includes('compare') || msg.includes('vs')) {
    return {
      text: `📊 **Bảng so sánh GPU phổ biến:**\n\n| GPU | VRAM | Gaming 1440p | AI/ML | Giá ước tính |\n|-----|------|------|------|------|\n| RTX 4060 | 8GB | 100fps+ | Tốt | ~12-15tr |\n| RTX 4070 | 12GB | 144fps+ | Rất tốt | ~20-25tr |\n| RTX 4080 | 16GB | 165fps+ | Xuất sắc | ~30-35tr |\n| RTX 4090 | 24GB | 240fps+ | Đỉnh cao | ~50-60tr |\n\n💡 **Khuyến nghị:**\n- Gaming 1080p → RTX 4060\n- Gaming 1440p → RTX 4070\n- 4K Gaming + AI → RTX 4080/4090\n\nBạn cần tư vấn cụ thể hơn không?`,
      products: [],
    };
  }

  // Default response
  return {
    text: `👋 Xin chào! Tôi là **TechBot AI** của TechStore.\n\nTôi có thể giúp bạn:\n🎮 **Gaming** - Laptop/PC gaming phù hợp\n💼 **Văn phòng** - Mỏng nhẹ, pin bền\n📚 **Sinh viên** - Giá tốt nhất tầm tiền\n🤖 **AI/ML** - Cấu hình mạnh xử lý AI\n\n**Câu hỏi gợi ý:**\n• "Laptop gaming dưới 20 triệu?"\n• "So sánh RTX 4060 vs RTX 4070"\n• "Laptop học IT ngành AI?"\n\nBạn cần tư vấn gì? 😊`,
    products: [],
  };
}

/**
 * Extract product IDs from AI response to show product cards
 */
function extractProductRecommendations(
  text: string,
  catalog: { id: string; name: string; price: number; category: string }[]
) {
  const cards: { id: string; name: string; price: number; image: string; category: string; slug: string }[] = [];

  for (const product of catalog) {
    const shortName = product.name.split(' ').slice(0, 3).join(' ');
    if (text.toLowerCase().includes(shortName.toLowerCase())) {
      cards.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200`,
        category: product.category,
        slug: product.id,
      });
      if (cards.length >= 3) break;
    }
  }

  return cards;
}
