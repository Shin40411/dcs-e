import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import { fCurrencyNoUnit } from "src/utils/format-number";
import { IContractData } from "src/types/contract";
import { RenderRuleNameChild } from "../helper/renderRuleNameChild";

type props = {
    total?: number;
    currentContract?: IContractData;
    discount?: number;
}

export const renderTable = ({ total, currentContract, discount }: props) => {
    const styles = useStyles();
    const roundedTotal = Math.round(total ?? 0);

    const totalPrice = currentContract?.items?.reduce(
        (sum, q) => sum + q.products.reduce((acc, p) => acc + p.price * p.quantity, 0),
        0
    ) ?? 0;

    const totalVat = currentContract?.items?.reduce((sum, q) => {
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
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>#</Text>
                    </View>
                    <View style={styles.cell_2}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>Tên SP/DV</Text>
                    </View>
                    <View style={[styles.cell_3, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>ĐVT</Text>
                    </View>
                    <View style={[styles.cell_4, { textAlign: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>SL</Text>
                    </View>
                    <View style={[styles.cell_4, { flexDirection: 'column', alignItems: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>Đơn giá</Text>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>{`(VNĐ)`}</Text>
                    </View>
                    <View style={[styles.cell_5, { textAlign: 'right', flexDirection: 'column', alignItems: 'center' }]}>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>Thành tiền</Text>
                        <Text style={[styles.text2Bold, { fontSize: 10 }]}>{`(VNĐ)`}</Text>
                    </View>
                </View>
            </View>

            <View>
                {currentContract?.items?.flatMap((q) =>
                    q.products.map((p, index) => (
                        <View key={p.id} style={styles.row}>
                            <View style={styles.cell_1}>
                                <Text>{index + 1}</Text>
                            </View>
                            <View style={styles.cell_2}>
                                <Text style={[styles.text2Semi, { fontSize: 10 }]}>{p.productName}</Text>
                                <Text style={[styles.textMontserrat, { fontSize: 10 }]}>{p.vat}% VAT</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{p.unit}</Text>
                            </View>
                            <View style={[styles.cell_3, { textAlign: 'center' }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{p.quantity}</Text>
                            </View>
                            <View style={[styles.cell_4, { textAlign: 'center' }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{fCurrencyNoUnit(p.price)}</Text>
                            </View>
                            <View style={[styles.cell_5, {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                textAlign: 'right'
                            }]}>
                                <Text style={[styles.text2, { fontSize: 10 }]}>{fCurrencyNoUnit(p.price * p.quantity)}</Text>
                                <Text style={[styles.textMontserrat, { fontSize: 10 }]}>{fCurrencyNoUnit(((p.price * p.quantity) * p.vat) / 100)}</Text>
                            </View>
                        </View>
                    ))
                )}

                {[
                    { name: 'Tổng:', value: fCurrencyNoUnit(totalPrice) },
                    { name: 'VAT:', value: fCurrencyNoUnit(totalVat), styles: styles.textMontserrat, isVat: true },
                    // { name: 'Khuyến mãi:', value: (discount ? fCurrencyNoUnit(discountAmount(totalPrice, totalVat, discount)) : 0) },
                    { name: 'Tổng cộng:', value: fCurrencyNoUnit(total), styles: styles.h5, isTotal: true },
                ].map((item, index) => (
                    <View key={item.name}
                        style={[
                            styles.row,
                            styles.noBorder,
                            index === 0 ? styles.rowFooter : {}
                        ]}
                        break wrap={false}
                    >
                        <View style={styles.cell_1} />
                        <View style={styles.cell_2} />
                        <View style={styles.cell_3} />

                        <View style={[styles.cell_4, { flexDirection: 'column' }]}>
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
                                    item.isTotal ? {
                                        fontFamily: 'Niramit-SemiBold',
                                        flexWrap: 'nowrap',
                                        fontSize: 11,
                                        textTransform: item.styles ? 'uppercase' : 'none',
                                    } : {
                                        fontFamily: item.isVat ? 'Niramit-ExtraLight' : 'Niramit-SemiBold',
                                        fontSize: 10
                                    },
                                ]}
                            >
                                {item.name}
                            </Text>
                        </View>

                        <View style={[styles.cell_5, { flexDirection: 'column', textAlign: 'right' }]}>
                            {item.isTotal && (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: 'rgba(0, 137, 0, 1)',
                                        width: 50,
                                        alignSelf: 'flex-end',
                                        marginBottom: 2,
                                    }}
                                />
                            )}
                            <Text
                                style={[
                                    item.isTotal
                                        ? { fontFamily: 'Niramit-SemiBold', fontSize: 11 }
                                        : { fontFamily: item.isVat ? 'Niramit-ExtraLight' : 'Niramit-SemiBold', fontSize: 10 }
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}