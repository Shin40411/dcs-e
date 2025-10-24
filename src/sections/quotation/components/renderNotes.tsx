import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";
import Html from 'react-pdf-html';

type props = {
    note?: string;
    employeeType?: string;
    department?: string;
    seller?: string;
}

export const renderNotes = ({ note, employeeType, department, seller }: props) => {
    const styles = useStyles();

    return (
        <View
            style={[
                styles.mt20,
                {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 39,
                    paddingRight: 20,
                },
            ]}
            wrap={false}
        >
            <View style={{ alignItems: 'flex-start', lineHeight: 1, flexShrink: 1, maxWidth: '70%' }} wrap={false}>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Text style={[styles.text1Bold, { fontSize: 14, marginBottom: 2 }]}>
                        Ghi chú
                    </Text>
                    {note ? (
                        <Html
                            stylesheet={{
                                "*": { fontSize: 12 },
                                p: {
                                    fontFamily: "Niramit-Light",
                                    marginTop: 0,
                                    marginBottom: 4,
                                },
                                em: {
                                    fontFamily: "Niramit-italic",
                                },
                                "p:first-child": { marginTop: 0 },
                                "p:last-child": { marginBottom: 0 },
                                strong: { fontFamily: "Niramit-SemiBold" },
                                '[style*="text-align: center"]': { textAlign: "center" },
                            }}
                        >
                            {note}
                        </Html>
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text4, { fontSize: 16, lineHeight: 2, marginRight: 6 }]}>
                                    {'\u2022'}
                                </Text>
                                <Text style={[styles.text4, { lineHeight: 1.5, width: 200 }]}>
                                    Giá trên đã bao gồm chi phí giao hàng tận nơi nội thành
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text4, { fontSize: 16, lineHeight: 2, marginRight: 6 }]}>
                                    {'\u2022'}
                                </Text>
                                <Text style={[styles.text4, { lineHeight: 2.3 }]}>
                                    Báo giá có giá trị trong vòng 30 ngày
                                </Text>
                            </View>

                        </>
                    )}
                </View>
            </View>

            <View style={{ alignItems: 'center', lineHeight: 1, flexShrink: 0, maxWidth: '30%', marginRight: 40 }}>
                <Text style={[styles.text1Bold, { fontSize: 13 }]}>Người lập</Text>
                {/* {(employeeType && department) &&
                    <Text style={[styles.text1Bold, { fontSize: 13, textTransform: 'uppercase' }]}>{`${employeeType ?? ''} / ${department ?? ''}`}</Text>
                } */}

                <View style={{ height: 60 }} />

                {/* <Text style={[styles.text1Bold, { fontSize: 13 }]}>{seller ?? `Họ và tên`}</Text> */}
            </View>
        </View>
    );
}