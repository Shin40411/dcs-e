import { StyleSheet } from "@react-pdf/renderer";

export const useStylesTicket = StyleSheet.create({
    page: {
        fontFamily: "Niramit-Medium",
        fontSize: 11,
        paddingTop: 10,
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    body: {
        flex: '1 1',
        paddingHorizontal: 25
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 4,
        marginBottom: 8,
    },
    leftHeader: {
        width: "60%",
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 4,
    },
    companyName: {
        fontSize: 12,
        fontFamily: 'Niramit-Bold',
    },
    companyInfo: {
        fontFamily: 'Niramit-Light',
        fontSize: 10,
    },
    rightHeader: {
        fontSize: 10,
        fontFamily: 'Niramit-Light',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        textAlign: "center",
        fontSize: 20,
        fontFamily: 'Montserrat-bold',
    },
    date: {
        fontFamily: 'Niramit-italic',
        textAlign: "center",
        fontSize: 13,
        marginBottom: 10,
    },
    fieldRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    contractNumber: {
        fontSize: 13,
        fontFamily: 'Niramit-Medium'
    },
    label: {
        width: 110,
        fontWeight: "bold",
    },
    line: {
        flex: 1,
        borderBottom: "1 solid #000",
    },
    signatureContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderStyle: 'dashed',
        marginVertical: 10,
    },
    signatureBox: {
        textAlign: "center",
        height: '100px',
        width: "20%",
    },
    signatureLabel: {
        fontSize: 12,
        fontFamily: 'Niramit-Medium',
        marginBottom: 3,
    },
    signAndPrint: {
        fontSize: 12,
        fontFamily: 'Niramit-LightItalic'
    },
    textDefault: {
        fontSize: 14,
    },
    dotted: {
        borderBottom: "1 dashed #000",
    },
});