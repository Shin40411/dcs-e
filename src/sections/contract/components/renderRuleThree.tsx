import { Text, View } from "@react-pdf/renderer";
import { RenderRuleNameChild } from "../helper/renderRuleNameChild";
import { RenderRuleName } from "../helper/renderRuleName";

export const renderRuleThree = () => {
    const sideA = [
        '- Đơn vị thụ hưởng:',
        '- Tài khoản số:',
        '- Tại:'
    ];

    const sideB = [
        'CÔNG TY TNHH GIẢI PHÁP DCS',
        '8100868',
        'tại Ngân hàng Á Châu - PGD Thảo Điền - TP. HCM'
    ];

    const ruleThree = [
        '- Bảo hành: Bên B sẽ bảo hành thiết bị đã bàn bán trong thời hạn một năm cho bên A',
        '- Phần ngoài phạm vi bảo hành: Bên A phải đảm bảo sử dụng thiết bị theo đúng chỉ dẫn của nhà sản xuất, cũng như môi trường cho thiết bị hoạt động tốt. Nếu thiết bị bị hư hỏng do những nguyên nhân sau đây sẽ không thuộc phạm vi bảo hành: không sử dụng đúng hướng dẫn của nhà sản xuất, máy bị hư, vỡ do rơi, va chạm mạnh, cháy nổ, sét đánh, môi trường ẩm ướt, côn trùng xâm nhập hoặc nguồn điện không ổn định.',
        '- Dịch vụ sau thời hạn bảo hành: Bên B sẽ cung cấp các thiết bị thay thế, dịch vụ sửa chữa với giá ưu đãi nhất đối với tất cả các thiết bị đã cung cấp cho bên A.',
    ];

    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 5,
                flexDirection: 'column',
                gap: 5
            }}
        >
            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 15 }}>
                    - Mọi chi phí phát sinh liên quan đến việc chuyển khoản (nếu có) do Bên A chịu trách nhiệm thanh toán.
                </Text>
            </View>
            <RenderRuleNameChild sentence={`2.3 Thông tin chuyển khoản:`} />
            <View style={{ flexDirection: 'row', gap: 8, paddingLeft: 10 }}>
                <View style={{ flexDirection: 'column', gap: 3 }}>
                    {sideA.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 15 }}>
                            {item}
                        </Text>
                    ))}
                </View>
                <View style={{
                    flexDirection: 'column',
                    gap: 3,
                }}>
                    {sideB.map((item, index) => (
                        <Text key={index} style={{
                            fontSize: 13,
                            fontFamily: index === 0 ? "Niramit-Bold" : "Niramit",
                            textIndent: index === 0 ? 15 : index === 1 ? 5 : 0,
                        }}>
                            {item}
                        </Text>
                    ))}
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <RenderRuleName first="ĐIỀU 3:" second="TRỢ GIÚP KỸ THUẬT VÀ PHẠM VI BẢO HÀNH:" />
            </View>
            <View style={{ flexDirection: 'column', gap: 5 }}>
                {ruleThree.map((item, index) => (
                    <Text key={index} style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 20 }}>
                        {item}
                    </Text>
                ))}
                <View style={{ flexDirection: 'row', gap: 3 }}>
                    <Text style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 20 }}>
                        - Liên hệ bảo hành:
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: "Niramit-Bold", textIndent: 20 }}>
                        CÔNG TY TNHH GIẢI PHÁP DCS
                    </Text>
                </View>
            </View>
        </View>
    );
}