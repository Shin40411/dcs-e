import { Text, View } from "@react-pdf/renderer";

type props = {
    customerName?: string;
    companyName?: string;
    employeeType?: string;
};

export const renderSigner = ({ customerName, companyName, employeeType }: props) => {
    const sideA = [
        companyName ? `${companyName} / ${customerName}` : customerName,
        employeeType,
        customerName
    ];

    const sideB = [
        'CÔNG TY TNHH GIẢI PHÁP DCS',
        'GIÁM ĐỐC',
        'Nguyễn Chí Nhân Nghĩa'
    ];

    return (
        <View
            style={{
                paddingLeft: 50,
                paddingRight: 50,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 50
            }}>
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 150,
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        fontFamily: 'Niramit-Bold',
                        fontSize: 13,
                        textTransform: 'uppercase'
                    }}>
                        Bên A
                    </Text>
                    <Text style={{
                        fontFamily: 'Niramit-Bold',
                        fontSize: 13,
                        textTransform: 'uppercase',
                        color: 'rgba(238, 0, 51, 1)'
                    }}>
                        {sideA[0]}
                    </Text>
                    <Text style={{
                        fontFamily: 'Niramit-SemiBold',
                        fontSize: 13,
                        color: 'rgba(238, 0, 51, 1)'
                    }}>
                        {sideA[1]}
                    </Text>
                </View>
                <Text style={{
                    fontFamily: 'Niramit',
                    fontSize: 13,
                    marginTop: 60,
                    color: 'rgba(238, 0, 51, 1)'
                }}>
                    {sideA[2]}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 150,
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        fontFamily: 'Niramit-Bold',
                        fontSize: 13,
                        textTransform: 'uppercase'
                    }}>
                        Bên B
                    </Text>
                    <Text style={{
                        fontFamily: 'Niramit-Bold',
                        fontSize: 13,
                    }}>
                        {sideB[0]}
                    </Text>
                    <Text style={{
                        fontFamily: 'Niramit-SemiBold',
                        fontSize: 13,
                    }}>
                        {sideB[1]}
                    </Text>
                </View>
                <Text style={{
                    fontFamily: 'Niramit',
                    fontSize: 13,
                    marginTop: 60,
                    color: 'rgba(238, 0, 51, 1)'
                }}>
                    {sideB[2]}
                </Text>
            </View>
        </View>
    );
}