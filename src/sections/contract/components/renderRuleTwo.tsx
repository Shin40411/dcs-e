import { Text, View } from "@react-pdf/renderer";
import { RenderRuleNameChild } from "../helper/renderRuleNameChild";
import { RenderRuleName } from "../helper/renderRuleName";
import { fCurrencyNoUnit } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";
import { IDateValue } from "src/types/common";

type props = {
    downPayment?: number;
    nextPayment?: number;
    lastPayment?: number;
    signatureDate?: IDateValue;
    total?: number;
}

export const renderRuleTwo = ({ downPayment, nextPayment, lastPayment, signatureDate, total }: props) => {
    const phaseTexts = [
        "- Bên A thanh toán cho Bên B bằng hình thức chuyển khoản thành ba (03) đợt, cụ thể:",
        `Ngay sau khi ký hợp đồng, Bên A thanh toán cho Bên B số tiền ${fCurrencyNoUnit(downPayment)} (bằng chữ: …).`,
        `Trước ngày ${fDate(signatureDate)}, Bên A thanh toán cho Bên B số tiền ${fCurrencyNoUnit(nextPayment)} (bằng chữ: …).`,
        `Trong vòng 15 (mười lăm) ngày kể từ ngày Bên B bàn giao thiết bị cho Bên A, Bên A thanh toán cho Bên B 30% (ba mươi phần trăm) giá trị hợp đồng, tương đương ${fCurrencyNoUnit(lastPayment)} (bằng chữ: …).`
    ];

    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 5,
                marginBottom: 15,
                flexDirection: 'column',
                gap: 5
            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 13,
                        fontFamily: "Niramit",
                        textIndent: 22
                    }}
                >
                    {`Điều kiện kỹ thuật, các thông số kỹ thuật của hàng hóa đáp ứng theo đúng các thỏa thuận giữa hai bên.`}
                </Text>
            </View>
            <View style={{ marginTop: 5, marginBottom: 5 }}>
                <RenderRuleName first="ĐIỀU 2:" second="GIÁ TRỊ VÀ PHƯƠNG THỨC THANH TOÁN HỢP ĐỒNG:" />
            </View>
            <RenderRuleNameChild sentence={`2.1 Tổng giá trị hợp đồng là: ${fCurrencyNoUnit(total)} VNĐ`} />
            <View style={{ flexDirection: 'row', gap: 3 }}>
                <Text
                    style={{
                        fontFamily: 'Niramit-italic',
                        textIndent: 22,
                        fontSize: 13
                    }}
                >
                    (Bằng chữ:
                </Text>
                <Text
                    style={{
                        fontFamily: 'Niramit-BoldItalic',
                        textIndent: 22,
                        fontSize: 13
                    }}
                >
                    Một triệu tám trăm chín mươi nghìn đồng).
                </Text>
            </View>
            <View style={{
                marginTop: 6,
                marginBottom: 6
            }}>
                <Text
                    style={{
                        fontFamily: 'Niramit',
                        textIndent: 22,
                        fontSize: 13,
                        textAlign: 'justify'
                    }}>
                    {`- Giá trị hợp đồng đã bao gồm toàn bộ chi phí vận chuyển đến [địa chỉ theo yêu cầu của khách hàng], chi phí lắp đặt, nghiệm thu, bảo hành, thuế nhập khẩu thiết bị, thuế giá trị gia tăng (VAT) và các chi phí liên quan khác. Trường hợp phát sinh chi phí vận chuyển ngoài phạm vi nêu trên, Bên A có trách nhiệm thanh toán theo số tiền ghi trên hóa đơn do đơn vị vận chuyển cung cấp.`}
                </Text>
            </View>
            <RenderRuleNameChild sentence={`2.2 Thông tin và Phương thức thanh toán:`} />
            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: "Niramit", lineHeight: 1.6 }}>
                    {phaseTexts.map((item, index) => (
                        <Text key={index} style={{
                            textIndent: index === 0 ? 15 : 0,
                        }}>
                            {index !== 0 && (
                                <Text style={{ fontFamily: "Niramit-SemiBold", textIndent: 15 }}>
                                    + Đợt {index}:
                                </Text>
                            )}{" "}
                            {item}
                            {index < phaseTexts.length - 1 ? "\n" : ""}
                        </Text>
                    ))}
                </Text>
            </View>
        </View>
    );
}