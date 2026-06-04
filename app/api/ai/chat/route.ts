/**
 * AI Chat API Route
 * POST /api/ai/chat – Send message to Gemini AI
 */
import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRODUCTS } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';

export const maxDuration = 30;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kc-may-tinh.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], productContext } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Thiếu nội dung tin nhắn' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Compact catalog – only essential fields to avoid context overflow
    const productCatalog = ALL_PRODUCTS.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      link: `${SITE_URL}/products/${p._id}`,
      category: p.category,
      brand: p.brand,
      price: formatPrice(p.price),
      priceRaw: p.price,
      cpu: p.specs?.cpu,
      gpu: p.specs?.gpu,
      ram: p.specs?.ram,
      storage: p.specs?.storage,
      display: p.specs?.display,
      useCases: p.useCases?.join(', '),
      rating: p.rating,
      isBestseller: p.isBestseller,
      featured: p.featured,
      stock: p.stock > 0 ? 'Còn hàng' : 'Hết hàng',
    }));

    // Group catalog by category for readability in prompt
    const laptops = productCatalog.filter((p) => p.category === 'laptop');
    const pcs = productCatalog.filter((p) => p.category === 'pc-gaming');
    const monitors = productCatalog.filter((p) => p.category === 'monitor');
    const peripherals = productCatalog.filter((p) => !['laptop', 'pc-gaming', 'monitor'].includes(p.category));

    const formatCatalogSection = (
      items: typeof productCatalog,
      title: string
    ) =>
      `### ${title} (${items.length} sản phẩm)\n` +
      items
        .map(
          (p) =>
            `- [${p.name}](${p.link}) | ${p.price} | ⭐${p.rating} | ${p.stock}` +
            (p.cpu ? ` | CPU: ${p.cpu}` : '') +
            (p.gpu ? ` | GPU: ${p.gpu}` : '') +
            (p.ram ? ` | RAM: ${p.ram}` : '') +
            (p.useCases ? ` | Dùng cho: ${p.useCases}` : '')
        )
        .join('\n');

    const systemPrompt = `Bạn là Linh - nhân viên tư vấn bán hàng nữ xinh đẹp, thân thiện, lễ phép và nhiệt tình của TechStore.
Bạn tuyệt đối KHÔNG được nói mình là AI, bot hay trợ lý ảo. Bạn là người thật.
Xưng "em", gọi khách là "anh/chị". Nói chuyện tự nhiên, thân thiện, có cảm xúc.

## THÔNG TIN CỬA HÀNG:
- Tên: TechStore | Hotline: 1800-TECH-AI
- Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM | Giờ: 8:00 - 22:00
- Giao hàng miễn phí đơn từ 5 triệu | Bảo hành: 12-24 tháng
- Đổi trả: 30 ngày | Trả góp 0% 12 tháng

## KHUYẾN MÃI:
- GAMING10: Giảm 10% laptop gaming
- Tặng chuột + bàn phím khi mua PC Gaming từ 20 triệu
- Flash sale cuối tuần: Giảm đến 20%

${productContext ? `## SẢN PHẨM KHÁCH ĐANG XEM:\nTên: ${productContext.name} | Giá: ${formatPrice(productContext.price)} | Link: ${SITE_URL}/products/${(productContext as any)._id || ''}\n` : ''}

## TOÀN BỘ SẢN PHẨM CỬA HÀNG:

${formatCatalogSection(laptops, 'LAPTOP')}

${formatCatalogSection(pcs, 'PC GAMING')}

${formatCatalogSection(monitors, 'MÀN HÌNH')}

${formatCatalogSection(peripherals, 'PHỤ KIỆN (Chuột, Bàn phím, Tai nghe...)')}

## QUY TẮC TƯ VẤN:
1. Luôn xưng "em", gọi "anh/chị". Nói ngắn gọn, chân thành.
2. Khi tư vấn, hãy gọi đúng tên sản phẩm từ danh sách trên và giải thích lý do phù hợp với nhu cầu.
3. LUÔN kèm link sản phẩm dạng markdown [Tên sản phẩm](link) khi nhắc đến bất kỳ sản phẩm nào.
4. Nếu khách hỏi "link", "mua ở đâu", "cho xem" → gửi link ngay, không trì hoãn.
5. Hỏi thêm nhu cầu (ngân sách, mục đích dùng) để tư vấn chính xác hơn.
6. Dùng emoji dễ thương, cảm thán tự nhiên. Tối đa 300 từ mỗi câu trả lời.`;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      const mockResponse = generateMockResponse(message, productCatalog);
      return NextResponse.json({
        success: true,
        response: mockResponse.text,
        productCards: mockResponse.products,
      });
    }

    const validHistory = history
      .filter((h: any) => h.content && !h.content.includes('Linh của TechStore') && !h.content.includes('Linh** - Nhân viên tư vấn'))
      .map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

    const messages = [
      { role: 'user', parts: [{ text: systemPrompt + '\n\n---\nKhách hàng: Chào shop' }] },
      { role: 'model', parts: [{ text: 'Dạ em chào anh/chị ạ! 👋 Em là Linh của TechStore đây. Anh/chị đang cần tìm máy tính hay phụ kiện gì để em tư vấn cho mình nhé! 😊' }] },
      ...validHistory.slice(-8),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Xin lỗi, tôi không thể xử lý yêu cầu này. Vui lòng thử lại hoặc gọi hotline 1800-TECH-AI!';

    // Extract product cards with real thumbnails
    const productCards = extractProductRecommendations(aiText, ALL_PRODUCTS as any[]);

    return NextResponse.json({ success: true, response: aiText, productCards });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({
      success: true,
      response:
        '⚠️ Dạ hiện tại hệ thống AI của em đang bị quá tải hoặc mất kết nối. Anh/chị thông cảm giúp em nha!\n\nTrong lúc chờ đợi, anh/chị có thể:\n📞 Gọi hotline **1800-TECH-AI** (miễn phí)\n💬 Chat Zalo: **TechStore AI**\n\nHoặc anh/chị thử chat lại với em sau ít phút nhé! 🥰',
    });
  }
}

/**
 * Extract product IDs from AI response to show product cards with real thumbnails
 */
function extractProductRecommendations(
  text: string,
  allProducts: Array<{
    _id: string;
    name: string;
    price: number;
    thumbnail: string;
    category: string;
    slug: string;
  }>
) {
  const cards: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    slug: string;
  }[] = [];

  for (const product of allProducts) {
    // Match by product name (first 3 words) or by product ID in link
    const shortName = product.name.split(' ').slice(0, 3).join(' ');
    const mentionedByName = text.toLowerCase().includes(shortName.toLowerCase());
    const mentionedByLink = text.includes(`/products/${product._id}`);

    if (mentionedByName || mentionedByLink) {
      cards.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.thumbnail, // Use real product thumbnail
        category: product.category,
        slug: product._id,
      });
      if (cards.length >= 3) break;
    }
  }

  return cards;
}

/**
 * Smart mock responses when no API key is configured
 */
function generateMockResponse(
  message: string,
  products: {
    id: string;
    name: string;
    priceRaw: number;
    price: string;
    category: string;
    brand: string;
    useCases?: string;
    rating: number;
    link: string;
    slug: string;
  }[]
): {
  text: string;
  products: { id: string; name: string; price: number; image: string; category: string; slug: string }[];
} {
  const msg = message.toLowerCase();

  // Tìm sản phẩm được nhắc đến trong câu hỏi
  const mentionedProduct = products.find((p) =>
    msg.includes(p.name.toLowerCase()) || msg.includes(p.brand.toLowerCase())
  );

  // Hỏi link sản phẩm
  if (msg.includes('link') || msg.includes('mua ở đâu') || msg.includes('xem sản phẩm') || msg.includes('cho xem')) {
    const targets = mentionedProduct
      ? [mentionedProduct]
      : products.filter((p) => p.rating >= 4.7).slice(0, 3);

    return {
      text: `Dạ em gửi link sản phẩm cho anh/chị ngay ạ! 🛍️\n\n${targets
        .map((p) => `**[${p.name}](${p.link})** - ${p.price} | ⭐ ${p.rating}`)
        .join('\n\n')}\n\nAnh/chị nhấn vào tên sản phẩm để xem chi tiết nhé! Cần tư vấn thêm gì em luôn sẵn sàng ạ 😊`,
      products: targets.map((p) => ({
        id: p.id, name: p.name, price: p.priceRaw,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200',
        category: p.category, slug: p.id,
      })),
    };
  }

  // Giới thiệu shop
  if (msg.includes('giới thiệu') || msg.includes('có gì') || msg.includes('bán gì') || msg.includes('shop bán')) {
    return {
      text: `Dạ cửa hàng TechStore bên em chuyên cung cấp đa dạng sản phẩm công nghệ chính hãng ạ! 🎉\n\nBên em có đầy đủ:\n💻 **Laptop** (Gaming, Văn phòng, Học tập, AI/ML)\n🖥️ **PC Gaming & Workstation**\n📺 **Màn hình** (Gaming, Đồ họa, Văn phòng)\n⌨️ **Phụ kiện** (Chuột, Bàn phím, Tai nghe)\n\nAnh/chị đang quan tâm đến dòng sản phẩm nào để em Linh tư vấn chi tiết hơn nhé? 🥰`,
      products: [],
    };
  }

  // Gaming
  if (msg.includes('gaming') || msg.includes('game') || msg.includes('chơi game')) {
    const gamingProducts = products
      .filter((p) => p.useCases?.includes('gaming'))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    return {
      text: `Dạ để phục vụ nhu cầu gaming của anh/chị, em lọc ra được mấy bé này cấu hình cực ngon ạ: 🎮\n\n${gamingProducts
        .map((p, i) => `**${i + 1}. [${p.name}](${p.link})** - ${p.price} | ⭐ ${p.rating}/5`)
        .join('\n')}\n\n🔥 Đang có mã **GAMING10** giảm thêm 10% đấy ạ!\n\nAnh/chị đang chơi game gì và ngân sách khoảng bao nhiêu để em tư vấn chuẩn hơn? 😊`,
      products: gamingProducts.map((p) => ({
        id: p.id, name: p.name, price: p.priceRaw,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200',
        category: p.category, slug: p.id,
      })),
    };
  }

  // Văn phòng
  if (msg.includes('văn phòng') || msg.includes('office') || msg.includes('làm việc')) {
    const officeProducts = products
      .filter((p) => p.useCases?.includes('office'))
      .slice(0, 3);

    return {
      text: `Dạ nếu anh/chị dùng văn phòng thì em gợi ý mấy mẫu này, vừa mỏng nhẹ vừa pin trâu ạ: 💼\n\n${officeProducts
        .map((p, i) => `**${i + 1}. [${p.name}](${p.link})** - ${p.price} | ⭐ ${p.rating}/5`)
        .join('\n')}\n\nFreeship toàn quốc cho đơn từ 5 triệu nha! Anh/chị ưng mẫu nào chưa ạ? 🥰`,
      products: officeProducts.map((p) => ({
        id: p.id, name: p.name, price: p.priceRaw,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
        category: p.category, slug: p.id,
      })),
    };
  }

  // Sinh viên
  if (msg.includes('sinh viên') || msg.includes('học') || msg.includes('rẻ') || msg.includes('budget')) {
    const studentProducts = products
      .filter((p) => p.useCases?.includes('student') || p.priceRaw < 20_000_000)
      .sort((a, b) => a.priceRaw - b.priceRaw)
      .slice(0, 3);

    return {
      text: `Dạ với nhu cầu học tập, em chọn ra mấy mẫu siêu đáng mua này ạ: 📚\n\n${studentProducts
        .map((p, i) => `**${i + 1}. [${p.name}](${p.link})** - ${p.price} | ⭐ ${p.rating}/5`)
        .join('\n')}\n\n💡 Bên em có hỗ trợ trả góp 0% nên không lo áp lực tài chính đâu ạ. Anh/chị đang học ngành gì để em tư vấn sâu hơn nhé! 🎓`,
      products: studentProducts.map((p) => ({
        id: p.id, name: p.name, price: p.priceRaw,
        image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=200',
        category: p.category, slug: p.id,
      })),
    };
  }

  // AI/ML/Đồ họa
  if (msg.includes('machine learning') || msg.includes('deep learning') || msg.includes('đồ họa') || msg.includes('render') || msg.includes('ai')) {
    const aiProducts = products
      .filter((p) => p.useCases?.includes('ai') || p.useCases?.includes('graphic'))
      .sort((a, b) => b.priceRaw - a.priceRaw)
      .slice(0, 3);

    return {
      text: `Dạ làm AI/ML hay đồ họa thì cần GPU mạnh và RAM dư dả ạ, em chọn ra mấy con quái vật này: 🤖\n\n${aiProducts
        .map((p, i) => `**${i + 1}. [${p.name}](${p.link})** - ${p.price} | ⭐ ${p.rating}/5`)
        .join('\n')}\n\nCard RTX series tối ưu CUDA training AI cực mượt ạ! Anh/chị hay dùng TensorFlow hay PyTorch để em tư vấn sát hơn nhé!`,
      products: aiProducts.map((p) => ({
        id: p.id, name: p.name, price: p.priceRaw,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200',
        category: p.category, slug: p.id,
      })),
    };
  }

  // Default
  return {
    text: `Dạ em nghe ạ! Anh/chị đang có nhu cầu tìm Laptop, PC Gaming, Màn hình hay phụ kiện gì để em Linh tư vấn kỹ hơn nha? 🥰\n\nMột số câu hỏi gợi ý:\n• "Laptop gaming dưới 25 triệu"\n• "Máy làm đồ họa, video editing"\n• "Link sản phẩm ASUS ROG"\n• "PC gaming build 30 triệu"\n\nAnh/chị cứ nhắn thoải mái ạ! 😊`,
    products: [],
  };
}
