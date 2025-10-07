import {
    Fragment,
} from "react";
import { Text, View } from "@react-pdf/renderer";

type props = {
    customerAddress?: string;
    customerPhone?: string;
    customerName?: string;
    customerBankNo?: string;
    customerBank?: string;
    companyName?: string;
}

export const renderTwoSides = ({
    customerAddress,
    customerPhone,
    customerName,
    customerBankNo,
    customerBank,
    companyName
}: props) => {
    const SideLeft = [
        "- Địa chỉ:",
        "- Điện thoại:",
        "- Đại diện:",
        "- Mã số thuế:",
        "- Tài khoản số:"
    ];

    const ASideRight = [
        customerAddress ? customerAddress : 'Chưa có',
        customerPhone,
        customerName,
        'Chưa có',
        customerBankNo ? `${customerBankNo}, tại Ngân hàng ${customerBank}` : 'Chưa có'
    ];

    const BSideRight = [
        "Số 1/50/5/16, Thanh Đa, P. Bình Quới, TP. Hồ Chí Minh",
        "0932 090207",
        "NGUYỄN CHÍ NHÂN NGHĨA",
        "0312456133",
        "167058479, tại Ngân hàng Á Châu - Chi nhánh Bình Thạnh - TP. HCM"
    ];
    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 5,
                marginBottom: 15
            }}
        >
            {/* Bên A */}
            <View style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                                marginBottom: 4
                            }
                        }
                    >
                        Bên A (Bên mua):
                    </Text>
                    {SideLeft.map((item, index) => (
                        <Text
                            key={index}
                            style={
                                {
                                    fontSize: 13,
                                    fontFamily: "Niramit",
                                    marginBottom: 4,
                                    textIndent: 20
                                }
                            }
                        >
                            {item}
                        </Text>
                    ))}
                </View>
                <View
                    style={{
                        marginLeft: 25,
                        display: 'flex',
                        flexDirection: 'column',
                        paddingRight: 60
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                                marginBottom: 4,
                                color: 'rgba(238, 0, 51, 1)'
                            }
                        }
                    >
                        {`${companyName ? `${companyName} / ${customerName}` : customerName}`}
                    </Text>
                    {ASideRight.map((item, index) => (
                        <Text
                            key={index}
                            style={
                                {
                                    fontSize: 13,
                                    fontFamily: "Niramit",
                                    marginBottom: 4,
                                    color: 'rgba(238, 0, 51, 1)'
                                }
                            }
                        >
                            {item}
                        </Text>
                    ))}
                </View>
                <View
                    style={{
                        position: 'absolute',
                        width: 100,
                        top: 60,
                        right: 0,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit",
                            }
                        }
                    >
                        Chức vụ:
                    </Text>
                    <Text
                        style={
                            {
                                marginLeft: 25,
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                                color: 'rgba(238, 0, 51, 1)'
                            }
                        }
                    >
                        {'Chưa có'}
                    </Text>
                </View>
            </View>
            {/* Bên B */}
            <View style={{
                marginTop: 10,
                display: 'flex',
                flexDirection: 'row',
                position: 'relative'
            }}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                                marginBottom: 4
                            }
                        }
                    >
                        Bên B (Bên bán):
                    </Text>
                    {SideLeft.map((item, index) => (
                        <Text
                            key={index}
                            style={
                                {
                                    fontSize: 13,
                                    fontFamily: "Niramit",
                                    marginBottom: 4,
                                    textIndent: 20
                                }
                            }
                        >
                            {item}
                        </Text>
                    ))}
                </View>
                <View
                    style={{
                        marginLeft: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        paddingRight: 60
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                                marginBottom: 4,
                            }
                        }
                    >
                        CÔNG TY TNHH GIẢI PHÁP DCS
                    </Text>
                    {BSideRight.map((item, index) => (
                        <Fragment key={index}>
                            {index === 2 ? (
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 3,
                                        marginBottom: 4,
                                    }}
                                >
                                    <Text style={{ fontSize: 13, fontFamily: "Niramit" }}>Ông</Text>
                                    <Text style={{ fontSize: 13, fontFamily: "Niramit-Bold" }}>
                                        {item}
                                    </Text>
                                </View>
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontFamily: "Niramit",
                                        marginBottom: 4,
                                    }}
                                >
                                    {item}
                                </Text>
                            )}
                        </Fragment>
                    ))}
                </View>
                <View
                    style={{
                        position: 'absolute',
                        width: 100,
                        top: 60,
                        right: 0,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={
                            {
                                fontSize: 13,
                                fontFamily: "Niramit",
                            }
                        }
                    >
                        Chức vụ:
                    </Text>
                    <Text
                        style={
                            {
                                marginLeft: 25,
                                fontSize: 13,
                                fontFamily: "Niramit-Bold",
                            }
                        }
                    >
                        Giám đốc
                    </Text>
                </View>
            </View>
            <View style={{
                marginTop: 10
            }}>
                <Text
                    style={{
                        fontFamily: 'Niramit-Medium',
                        fontSize: 13,
                        textIndent: 20
                    }}
                >
                    Hai Bên thống nhất ký kết Hợp đồng cung cấp thiết bị với các điều khoản sau đây:
                </Text>
            </View>
        </View>
    );
}