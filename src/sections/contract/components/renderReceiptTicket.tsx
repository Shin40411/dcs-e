import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useStylesTicket as styles } from "./useStyleTicket";
import { fCurrencyNoUnit, fRenderTextNumber, fRenderTextNumberNoUnit } from "src/utils/format-number";
import { capitalizeFirstLetter } from "src/utils/format-string";

interface ReceiptData {
    date: string;
    contractNo: string;
    receiptNo: string;
    payerName: string;
    address: string;
    reason: string;
    amount: number;
    attachment: string;
    createdBy: string;
}

interface RenderReceiptProps {
    data: ReceiptData;
}

export const RenderReceipt = ({ data }: RenderReceiptProps) => (
    <Document title={data.receiptNo}>
        <Page size="A3" style={styles.page}>
            <View style={styles.body} wrap={false}>
                <View>
                    <View style={styles.header}>
                        <View style={styles.leftHeader}>
                            <Image source="/logo/DCS9.png" style={{ width: 100, height: 55 }} />
                            <View>
                                <Text style={styles.companyName}>CÔNG TY TNHH GIẢI PHÁP DCS</Text>
                                <Text style={styles.companyInfo}>Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Text>
                                <Text style={styles.companyInfo}>MST.0318436084 | E. lienhe@dcse.vn  |  W.  http://dcse.vn</Text>
                            </View>
                        </View>
                        <View style={styles.rightHeader}>
                            <Text style={{ fontFamily: 'Niramit-Bold' }}>Mẫu số 01 - TT</Text>
                            <Text>(Ban hành theo Thông tư số 200/2014/TT-BTC)</Text>
                            <Text>Ngày 22/12/2014 của Bộ Tài chính</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10,
                            height: '100%',
                            width: '70%',
                            marginLeft: 100
                        }}>
                            <Text style={styles.title}>PHIẾU THU</Text>
                            <Text style={styles.date}>ngày {data.date}</Text>
                        </View>

                        <View style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {data.contractNo && <Text style={styles.contractNumber}>Số HĐ: {data.contractNo}</Text>}
                            <Text style={styles.contractNumber}>Số PT: {data.receiptNo}</Text>
                            <Text style={styles.contractNumber}>Nợ: ............................</Text>
                            <Text style={styles.contractNumber}>Có: ............................</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 40, marginTop: 30, marginBottom: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 200 }}>
                        <Text style={styles.textDefault}>Họ và tên người nộp tiền: {data.payerName ? data.payerName : '....................'}</Text>
                        <Text style={styles.textDefault}>Địa chỉ: {data.address ? data.address : '....................'}</Text>
                        <Text style={styles.textDefault}>Lý do nộp: {data.reason ? data.reason : '....................'}</Text>
                        <Text style={styles.textDefault}>Số tiền: {fCurrencyNoUnit(data.amount)} VNĐ (Viết bằng chữ): {data.amount ? capitalizeFirstLetter(fRenderTextNumber(data.amount)) : '....................'}</Text>
                        <Text style={styles.textDefault}>Hình thức thu tiền: TM/CK</Text>
                        <Text style={styles.textDefault}>Kèm theo: {data.attachment}........................................Chứng từ gốc:</Text>
                    </View>
                </View>
                <View style={styles.signatureContainer}>
                    {[
                        "Giám đốc",
                        "Kế toán",
                        "Người nộp tiền",
                        "Người lập phiếu",
                        "Thủ quỹ",
                    ].map((title, index) => (
                        <View key={title} style={styles.signatureBox}>
                            <View>
                                <Text style={styles.signatureLabel}>{title}</Text>
                                <Text style={styles.signAndPrint}>{index === 0 ? '(Ký, họ tên, đóng dấu)' : '(Ký, họ tên)'}</Text>
                            </View>
                            {index === 3 &&
                                <Text style={styles.signatureLabel}>{data.createdBy}</Text>
                            }
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.body} wrap={false}>
                <View>
                    <View style={styles.header}>
                        <View style={styles.leftHeader}>
                            <Image source="/logo/DCS9.png" style={{ width: 100, height: 55 }} />
                            <View>
                                <Text style={styles.companyName}>CÔNG TY TNHH GIẢI PHÁP DCS</Text>
                                <Text style={styles.companyInfo}>Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Text>
                                <Text style={styles.companyInfo}>MST.0318436084 | E. lienhe@dcse.vn  |  W.  http://dcse.vn</Text>
                            </View>
                        </View>
                        <View style={styles.rightHeader}>
                            <Text style={{ fontFamily: 'Niramit-Bold' }}>Mẫu số 01 - TT</Text>
                            <Text>(Ban hành theo Thông tư số 200/2014/TT-BTC)</Text>
                            <Text>Ngày 22/12/2014 của Bộ Tài chính</Text>
                        </View>
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10,
                            height: '100%',
                            width: '70%',
                            marginLeft: 100
                        }}>
                            <Text style={styles.title}>PHIẾU THU</Text>
                            <Text style={styles.date}>ngày {data.date}</Text>
                        </View>

                        <View style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {data.contractNo && <Text style={styles.contractNumber}>Số HĐ: {data.contractNo}</Text>}
                            <Text style={styles.contractNumber}>Số PT: {data.receiptNo}</Text>
                            <Text style={styles.contractNumber}>Nợ: ............................</Text>
                            <Text style={styles.contractNumber}>Có: ............................</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 40, marginTop: 30, marginBottom: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 200 }}>
                        <Text style={styles.textDefault}>Họ và tên người nộp tiền: {data.payerName ? data.payerName : '....................'}</Text>
                        <Text style={styles.textDefault}>Địa chỉ: {data.address ? data.address : '....................'}</Text>
                        <Text style={styles.textDefault}>Lý do nộp: {data.reason ? data.reason : '....................'}</Text>
                        <Text style={styles.textDefault}>Số tiền: {fCurrencyNoUnit(data.amount)} VNĐ (Viết bằng chữ): {data.amount ? capitalizeFirstLetter(fRenderTextNumber(data.amount)) : '....................'}</Text>
                        <Text style={styles.textDefault}>Hình thức thu tiền: TM/CK</Text>
                        <Text style={styles.textDefault}>Kèm theo: {data.attachment}........................................Chứng từ gốc:</Text>
                    </View>
                </View>
                <View style={styles.signatureContainer}>
                    {[
                        "Giám đốc",
                        "Kế toán",
                        "Người nộp tiền",
                        "Người lập phiếu",
                        "Thủ quỹ",
                    ].map((title, index) => (
                        <View key={title} style={styles.signatureBox}>
                            <View>
                                <Text style={styles.signatureLabel}>{title}</Text>
                                <Text style={styles.signAndPrint}>{index === 0 ? '(Ký, họ tên, đóng dấu)' : '(Ký, họ tên)'}</Text>
                            </View>
                            {index === 3 &&
                                <Text style={styles.signatureLabel}>{data.createdBy}</Text>
                            }
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);