import { Text, View } from "@react-pdf/renderer";

export const renderTitle = (contractNo?: string) => (
    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Niramit-SemiBold', fontSize: 14 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
        </View>

        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Niramit-SemiBold', fontSize: 14 }}>
                Độc lập – Tự do – Hạnh phúc
            </Text>
            <View
                style={{
                    marginTop: 2,
                    height: 1,
                    width: '33%',
                    backgroundColor: '#000',
                    alignSelf: 'center',
                }}
            />
        </View>

        <View style={{ marginTop: 15, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Niramit-Bold', fontSize: 16 }}>
                HỢP ĐỒNG MUA BÁN
            </Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Niramit-Bold', fontSize: 13 }}>
                Số: {contractNo}
            </Text>
        </View>
    </View>
);