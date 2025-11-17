import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

export const renderBillingInfo = (companyName?: string, customerName?: string, introtitle?: string) => {
    const styles = useStyles();

    const introSample = `Xin chân thành cảm ơn sự quan tâm của Quý khách.
                Chúng tôi xin gửi đến Quý khách bảng báo giá sản phẩm theo yêu cầu như sau:`;

    const intro = companyName ? 'Kính gửi:' : 'Kính gửi ông/bà:';
    return (
        <View style={[styles.containerColumn, styles.mb8, { padding: '0 40px 0 59px' }]}>
            <Text style={[styles.mb4, { fontFamily: 'Niramit-Bold', fontSize: 14 }]}>{intro}{'   '}{companyName ? companyName : customerName}</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Niramit' }}>
                {'\u00A0\u00A0\u00A0\u00A0'}{introtitle ? introtitle : introSample}
            </Text>
        </View>
    );
};