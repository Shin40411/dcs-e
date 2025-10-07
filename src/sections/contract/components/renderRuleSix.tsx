import { Text, View } from "@react-pdf/renderer";
import { RenderRuleName } from "../helper/renderRuleName";

export const renderRuleSix = () => {
    const ruleSix = [
        ' - Hai bên cam kết thực hiện đúng các điều khoản của hợp đồng, bên nào vi phạm sẽ phải chịu trách nhiệm theo quy định của pháp luật.',
        '- Mọi thay đổi liên quan đến nội dung hợp đồng phải được thông báo bằng văn bản cho bên kia trước ít nhất 15 ngày. Mọi chi phí phát sinh cho thay đổi hợp đồng do nguyên nhân từ Bên nào thì Bên đó có trách nhiệm thanh toán.',
        '- Mọi tranh chấp trong quá trình thực hiện hợp đồng này nếu có sẽ được hai bên thương lượng giải quyết trên tinh thần hợp tác, tôn trọng lẫn nhau. Trường hợp hai bên không thống nhất giải quyết, thì vụ việc sẽ được chuyển lên Tòa Án có thẩm quyền để giải quyết. Quyết định của Toà là chung thẩm và có hiệu lực thi hành đối với các Bên.',
        '- Sau khi hai bên hoàn thành trách nhiệm của mình theo các điều khoản đã nêu trong hợp đồng này, 30 ngày sau đó hợp đồng mặc nhiên sẽ được thanh lý.',
        '- Hợp đồng này được lập thành 02 (hai) bản gốc, có giá trị pháp lý như nhau; Bên A giữ 01 (một) bản, Bên B giữ 01 (một) bản. Hợp đồng có hiệu lực kể từ ngày ký kết và là căn cứ ràng buộc trách nhiệm pháp lý giữa các Bên.'
    ];
    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 20,
                flexDirection: 'column',
                gap: 5
            }}
        >
            <RenderRuleName first="ĐIỀU 6:" second="ĐIỀU KHOẢN CHUNG:" />
            <View style={{
                marginTop: 2,
                flexDirection: 'column',
                gap: 5
            }}>
                {ruleSix.map((item, index) => (
                    <Text key={index} style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 20 }}>
                        {item}
                    </Text>
                ))}
            </View>
        </View>
    );
}