import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useStylesExport as styles } from "./useStylesExport";
import { IContractRemainingProduct } from "src/types/contract";
import { ICompanyInfoItem } from "src/types/companyInfo";

type RenderProps = {
    contractBody: Record<string, string>;
    productsUnExported: IContractRemainingProduct[];
    companyInfoData: ICompanyInfoItem | null;
};

export const RenderWarehouseExport = ({ contractBody, productsUnExported, companyInfoData }: RenderProps) => {
    return (
        <Document title={contractBody.warehouseExportNo}>
            <Page size="A4" style={styles.page}>
                <Header companyInfoData={companyInfoData} />
                <Title contractBody={contractBody} />
                <View style={styles.body}>
                    <View style={{ paddingHorizontal: 28 }}>
                        <Info contractBody={contractBody} />
                        <Table productsUnExported={productsUnExported} />
                        <Confirm />
                    </View>
                    <Signer contractBody={contractBody} />
                </View>
                <Footer companyInfoData={companyInfoData} />
            </Page>
        </Document>
    )
};

function Header({ companyInfoData }: { companyInfoData: ICompanyInfoItem | null }) {
    return (
        <View style={styles.header} fixed>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={companyInfoData?.logoBase64 || "/logo/DCS9.png"} style={{ width: 70, height: 40 }} />
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: 'Niramit-Bold', fontSize: 10 }}>{companyInfoData?.name}</Text>
                        <Text style={{ fontFamily: 'Niramit', fontSize: 7 }}>{companyInfoData?.address}</Text>
                        <Text style={{ fontFamily: 'Niramit', fontSize: 7 }}>{`MST.${companyInfoData?.taxCode} | E. ${companyInfoData?.email} | W.  ${companyInfoData?.link}`}</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Niramit-Bold', fontSize: 10 }}>Mẫu số 02 - VT</Text>
                    <Text style={{ fontFamily: 'Niramit', fontSize: 10 }}>(Ban hành theo Thông tư số 200/2014/TT-BTC</Text>
                    <Text style={{ fontFamily: 'Niramit', fontSize: 10 }}>Ngày 22/12/2014 của Bộ Tài chính)</Text>
                </View>
            </View>
        </View>
    )
}

function Title({ contractBody }: { contractBody: Record<string, string> }) {
    const warehouseNo = contractBody.warehouseExportNo.split('/')[0];
    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <View style={{ width: '55%', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontFamily: 'Montserrat-bold', fontSize: 16 }}>PHIẾU XUẤT KHO/ GIAO HÀNG</Text>
                <Text style={{ fontFamily: 'Niramit-LightItalic', fontSize: 13 }}>{contractBody.exportDate ? `ngày ${contractBody.exportDate}` : ''}</Text>
            </View>
            <View style={{ width: '45%', display: 'flex', paddingLeft: 20 }}>
                <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Số HĐ: {contractBody.contractNo}</Text>
                <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Số PX: {warehouseNo}</Text>
                <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Nợ: .......................</Text>
                <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Có: .......................</Text>
            </View>
        </View>
    )
}

function Info({ contractBody }: { contractBody: Record<string, string> }) {
    return (
        <View style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Người nhận hàng: {contractBody.receiverName}</Text>
            <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Địa chỉ (bộ phận): {contractBody.position}</Text>
            <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Lý do xuất kho: {contractBody.note}</Text>
            <Text style={{ fontFamily: 'Niramit-Medium', fontSize: 13 }}>Địa chỉ giao hàng: {contractBody.receiverAddress}</Text>
        </View>
    );
}

function Table({ productsUnExported }: { productsUnExported: IContractRemainingProduct[] }) {
    return (
        <View style={styles.table}>
            <View>
                <View style={styles.rowHeader}>
                    <View style={styles.cell_1}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>#</Text>
                    </View>
                    <View style={styles.cell_2}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>Tên hàng hóa / dịch vụ</Text>
                    </View>
                    <View style={[styles.cell_3, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>ĐVT</Text>
                    </View>
                    <View style={[styles.cell_4, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>SL</Text>
                    </View>
                </View>
            </View>
            <View>
                {productsUnExported
                    .map((p, index) => (
                        <View key={p.productID} style={styles.row} wrap={false}>
                            <View style={styles.cell_1}>
                                <Text>{index + 1}</Text>
                            </View>
                            <View style={styles.cell_2}>
                                <Text style={[styles.text2Semi, { fontSize: 10 }]}>{p.name}</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{p.productUnitName}</Text>
                            </View>
                            <View style={[styles.cell_4, { textAlign: 'center' }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{p.quantity}</Text>
                            </View>
                        </View>
                    ))
                }
                <View style={[styles.row, styles.noBorder, styles.rowFooter]} wrap={false} />
            </View>
        </View>
    );
}

function Confirm() {
    return (
        <View style={{ marginTop: 20, marginBottom: 40 }}>
            <Text style={{ fontFamily: 'Niramit', fontSize: 13, textAlign: 'center' }}>
                Hai bên xác nhận hàng hóa giao đúng và đủ số lượng. Hàng hóa mới 100%.
            </Text>
        </View>
    );
}

function Signer({ contractBody }: { contractBody: Record<string, string> }) {
    return (
        <View style={styles.signatureContainer} wrap={false}>
            {[
                "Người lập phiếu",
                "Người nhận hàng",
                "Kế toán",
                "Giám đốc",
            ].map((title, index) => (
                <View key={title} style={styles.signatureBox}>
                    <View>
                        <Text style={styles.signatureLabel}>{title}</Text>
                        <Text style={styles.signAndPrint} wrap={false}>{index === 3 ? '(Ký, họ tên, đóng dấu)' : '(Ký, họ tên)'}</Text>
                    </View>
                    {index === 3 ?
                        <Text style={styles.signatureLabel}>Nguyễn Chí Nhân Nghĩa</Text>
                        :
                        index === 1 ?
                            <Text style={styles.signatureLabel}>{contractBody.receiverName}</Text>
                            :
                            index === 0 ?
                                <Text style={styles.signatureLabel}>{contractBody.seller}</Text>
                                :
                                ''
                    }
                </View>
            ))}
        </View>
    );
}

function Footer({ companyInfoData }: { companyInfoData: ICompanyInfoItem | null }) {
    return (
        <View style={[styles.container, styles.footer]} fixed>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', width: '100%', alignItems: 'flex-end' }}>
                    <View style={{ marginTop: 5, paddingLeft: 70, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontFamily: 'Niramit',
                            fontSize: 8
                        }}
                        >
                            W.  {companyInfoData?.link}   |   E.  {companyInfoData?.email}
                        </Text>
                        <View style={{ width: 1, height: '100%', backgroundColor: '#ddd', marginLeft: 4, marginRight: 4 }} />
                        <Text
                            style={[styles.textNiramit, { fontSize: 11 }]}
                            render={({ pageNumber, totalPages }) =>
                                `Trang ${pageNumber}/${totalPages}`
                            }
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}