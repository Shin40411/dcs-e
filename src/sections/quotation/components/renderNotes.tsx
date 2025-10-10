import { Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

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
                    paddingLeft: 20,
                    paddingRight: 20,
                },
            ]}
        >
            <View style={{ alignItems: 'flex-start', lineHeight: 1, flexShrink: 1, maxWidth: '60%' }}>
                <Text style={[styles.text1Bold, { fontSize: 14 }]}>Ghi chú</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20, marginRight: 20 }}>
                    {note ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.text4]}>
                                {note}
                            </Text>
                        </View>
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

            <View style={{ alignItems: 'center', lineHeight: 1, flexShrink: 0, maxWidth: '35%' }}>
                <Text style={[styles.text1Bold, { fontSize: 13 }]}>Người lập</Text>
                {(employeeType && department) &&
                    <Text style={[styles.text1Bold, { fontSize: 13, textTransform: 'uppercase' }]}>{`${employeeType ?? ''} / ${department ?? ''}`}</Text>
                }

                <View style={{ height: 60 }} />

                <Text style={[styles.text1Bold, { fontSize: 13 }]}>{seller ?? `Họ và tên`}</Text>
            </View>
        </View>
    );
}