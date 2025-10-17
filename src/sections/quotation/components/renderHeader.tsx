import { Image, Text, View } from "@react-pdf/renderer";
import { useStyles } from "./useStyle";

export const renderHeader = () => {
    const styles = useStyles();

    return (
        <View style={[styles.header, styles.containerStart, styles.alignItemsStart, styles.ml10, styles.mb8]} fixed>
            <Image
                source="/assets/illustrations/bgpdf.png"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 1,
                }}
            />
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
                        <Text style={[styles.text2, { fontFamily: 'Niramit-Light' }]}>0312456133</Text>
                        <Text style={[styles.mb4, { fontFamily: 'Niramit-Light', fontSize: 12 }]}>
                            {`W.  http://dcse.vn   |   E.  lienhe@dcse.vn`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}