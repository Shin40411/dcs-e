import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { fCurrencyNoUnit } from "src/utils/format-number";
import { IQuotationData } from "src/types/quotation";

type props = {
    currentQuotation?: IQuotationData;
    discount?: number;
    totalAmount?: number;
}

export const renderTable = ({ currentQuotation, discount, totalAmount }: props) => {
    const styles = useStyles();
    const totalPrice = currentQuotation?.items?.reduce(
        (sum, q) => sum + q.products.reduce((acc, p) => acc + p.price * p.quantity, 0),
        0
    ) ?? 0;

    const totalVat = currentQuotation?.items?.reduce((sum, q) => {
        return (
            sum +
            q.products.reduce((subSum, p) => {
                const lineTotal = p.price * p.quantity;
                return subSum + (lineTotal * p.vat) / 100;
            }, 0)
        );
    }, 0) ?? 0;

    const discountAmount = (totalPrice: number, totalVat: number, discountPercent: number) =>
        Math.round((totalPrice + totalVat) * (discountPercent / 100));
    return (
        <View style={styles.table}>
            <View>
                <View style={styles.rowHeader}>
                    <View style={styles.cell_1}>
                        <Text style={[styles.text2Bold]}>#</Text>
                    </View>
                    <View style={styles.cell_2}>
                        <Text style={[styles.text2Bold]}>Tên hàng hóa /dịch vụ</Text>
                    </View>
                    <View style={[styles.cell_3, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold]}>ĐVT</Text>
                    </View>
                    <View style={[styles.cell_4, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold]}>SL</Text>
                    </View>
                    <View style={[styles.cell_4, { flexDirection: 'column', alignItems: 'center' }]}>
                        <Text style={[styles.text2Bold]}>Đơn giá</Text>
                        <Text style={[styles.text2Bold]}>{`(VNĐ)`}</Text>
                    </View>
                    <View style={[styles.cell_5, {
                        textAlign: 'right',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: 20
                    }]}>
                        <Text style={[styles.text2Bold]}>Thành tiền</Text>
                        <Text style={[styles.text2Bold]}>{`(VNĐ)`}</Text>
                    </View>
                </View>
            </View>

            <View>
                {currentQuotation?.items?.flatMap((q) =>
                    q.products.map((p, index) => (
                        <View key={p.id} style={styles.row}>
                            <View style={styles.cell_1}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{index + 1}</Text>
                            </View>
                            <View style={styles.cell_2}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{p.productName}</Text>
                                <Text style={{ fontFamily: 'Niramit-ExtraLight', fontSize: 10 }}>{p.vat}% VAT</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{p.unit}</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{p.quantity}</Text>
                            </View>
                            <View style={[styles.cell_4, { textAlign: 'center' }]}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{fCurrencyNoUnit(p.price)}</Text>
                            </View>
                            <View style={[styles.cell_5, {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                textAlign: 'right',
                                marginLeft: 20
                            }]}>
                                <Text style={{ fontFamily: 'Niramit', fontSize: 12 }}>{fCurrencyNoUnit(p.price * p.quantity)}</Text>
                                <Text style={{ fontFamily: 'Niramit-ExtraLight', fontSize: 10 }}>{fCurrencyNoUnit(((p.price * p.quantity) * p.vat) / 100)}</Text>
                            </View>
                        </View>
                    ))
                )}

                {[
                    { name: 'Tổng:', value: fCurrencyNoUnit(totalPrice) },
                    { name: 'VAT:', value: fCurrencyNoUnit(totalVat), styles: styles.textNiramit },
                    { name: 'Khuyến mãi:', value: (discount ? fCurrencyNoUnit(discountAmount(totalPrice, totalVat, discount)) : null) },
                    { name: 'Tổng cộng:', value: fCurrencyNoUnit(totalAmount), styles: styles.h5, isTotal: true },
                ].map((item, index) => {
                    if (!item.value) return null;
                    return (
                        <View key={item.name}
                            style={[
                                styles.row,
                                styles.noBorder,
                                index === 0 ? styles.rowFooter : {}
                            ]}>
                            <View style={{ width: '15%' }} />
                            <View style={{ width: '15%' }} />
                            <View style={{ width: '35%' }} />

                            <View style={{ width: '35%', paddingLeft: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    {item.isTotal && (
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: 'rgba(0, 137, 0, 1)',
                                                width: 100,
                                                alignSelf: 'flex-start',
                                                marginBottom: 2,
                                            }}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            item.styles ?? { fontFamily: 'Niramit-SemiBold', fontSize: 13 },
                                            item.isTotal ? {
                                                textTransform: item.styles ?
                                                    'uppercase' : 'none', fontFamily: 'Niramit-Bold', fontSize: 14
                                            } : {}
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'column', textAlign: 'right' }}>
                                    {item.isTotal && (
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: 'rgba(0, 137, 0, 1)',
                                                width: 78,
                                                alignSelf: 'flex-end',
                                                marginBottom: 2,
                                            }}
                                        />
                                    )}
                                    <Text style={[
                                        item.styles ?? { fontFamily: 'Niramit-SemiBold', fontSize: 13 },
                                        item.isTotal
                                            ? { fontFamily: 'Niramit-Bold', fontSize: 14 }
                                            : {}]}
                                    >{item.value}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

            </View>
        </View>
    );
}