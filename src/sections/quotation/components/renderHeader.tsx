import { Image, Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

export const renderHeader = () => {
    const styles = useStyles();

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <View style={{ alignItems: 'center' }}>
                <Image source="/logo/DCS9.png" style={{ width: 100, height: 60 }} />
            </View>

            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <Text style={[styles.textBoldHeader]}>CÔNG TY TNHH GIẢI PHÁP DCS</Text>
                <Text style={[styles.text2, { fontFamily: 'Niramit-Light' }]}>Số 1/50/5/16, Thanh Đa, Phường Bình Quới, TP.Hồ Chí Minh</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <Text style={[styles.mb4, { fontFamily: 'Niramit-Light', fontSize: 12 }]}>
                        {`MST. 0318436084 | E.  lienhe@dcse.vn | W.  http://dcse.vn`}
                    </Text>
                </View>
            </View>
        </View>
    );
}