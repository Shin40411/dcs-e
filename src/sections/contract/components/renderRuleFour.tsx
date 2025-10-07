import { Text, View } from "@react-pdf/renderer";
import { RenderRuleName } from "../helper/renderRuleName";

export const renderRuleFour = () => {
    const ruleFour = [
        '- Trong quá trình thực hiện Hợp Đồng, hai bên nếu có phát sinh gì về Hợp Đồng phải gửi yêu cầu như một bản Phụ Lục Hợp Đồng đính kèm, phụ lục này là một phần không thể tách rời đối với hợp đồng.',
        '- Nếu một trong hai bên hoàn toàn không thực hiện Hợp Đồng thì phải chịu phạt Hợp Đồng ở mức cao nhất của khung hình phạt là 5% giá trị Hợp Đồng. Nếu hợp đồng mua bán có hạng mục Phần mềm bản quyền, bên A phải thanh toán 100% cho bên B hạng mục này trong mọi trường hợp tranh chấp hay hủy hợp đồng.',
        '- Bên A phải thanh toán cho bên B theo đúng thời hạn quy định. Nếu Bên A thanh toán chậm hơn so với kế hoạch thì sẽ chịu mức phạt là 0.1% tổng giá trị hợp đồng cho mỗi ngày chậm và không vượt quá 7 ngày. Sau 7 ngày bên B có quyền thu hồi lại sản phẩm và không hoàn cọc. Bên A tạo mọi điều kiện thuận lợi để bên B giao hàng.',
        '- Bên B phải giao hàng hóa đúng số lượng, chất lượng như đã thỏa thuận. Nếu bên B giao hàng hóa không đúng, Bên A có quyền từ chối nhận lô hàng đó và phải tiến hành giao ngay lô hàng khác theo đúng chất lượng, quy cách theo đúng thỏa thuận hai bên như Hợp Đồng đã nêu.',
        '- Việc kiểm tra các hàng hóa, thiết bị cho lô hàng sẽ do kỹ thuật của Bên B thực hiện với sự hỗ trợ của bên A và được thể hiện bằng biên bản nghiệm thu.',
        '- Đảm bảo thực hiện đúng theo hợp đồng đã ký, linh kiện và thiết bị được giao đúng chủng loại, quy cách.',
        '- Thời gian bàn giao thiết bị trong vòng 10 ngày kể từ ngày hợp đồng được ký kết. Trong trường hợp Bên B chậm giao hàng Bên B sẽ chịu phạt giao hàng chậm là 0.1% (không phẩy một phần trăm) tổng trị giá hợp đồng/số ngày chậm giao hàng ngoại trừ trường hợp sau đây Bên B có thông báo cho bên A trước ngày giao hàng bằng văn bản các đối tác cung cấp hết hàng.',
        '- Bảo hành thiết bị đúng như điều 3 của hợp đồng.'
    ];
    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 20,
                marginBottom: 15,
                flexDirection: 'column',
                gap: 5
            }}
        >
            <RenderRuleName first="ĐIỀU 4:" second={`CÁC BIỆN PHÁP BẢO ĐẢM THỰC HIỆN HỢP ĐỒNG VÀ TRÁCH NHIỆM HAI BÊN:`} />
            <View style={{
                marginTop: 2,
                flexDirection: 'column',
                gap: 5
            }}>
                {ruleFour.map((item, index) => (
                    <Text key={index} style={{ fontSize: 13, fontFamily: "Niramit", textIndent: 20 }}>
                        {item}
                    </Text>
                ))}
            </View>
        </View>
    );
}