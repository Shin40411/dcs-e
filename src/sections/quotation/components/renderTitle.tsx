import { Text, View } from "@react-pdf/renderer";

export const renderTitle = () => (
    <View style={{ width: '100%', margin: '10px 0', textAlign: 'center' }}>
        <Text style={{ fontFamily: 'Montserrat-bold', fontSize: 20, fontWeight: 600, textTransform: 'uppercase' }}>Bảng báo giá</Text>
        <View
            style={{
                height: 1,
                width: 60,
                backgroundColor: 'rgba(0, 137, 0, 1)',
                marginTop: 8,
                alignSelf: 'center',
            }}
        />
    </View>
);
