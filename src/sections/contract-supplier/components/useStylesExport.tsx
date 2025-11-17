import { StyleSheet } from "@react-pdf/renderer";
const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 80;
export const useStylesExport = StyleSheet.create({
    page: {
        fontSize: 9,
        fontFamily: 'Niramit-Medium',
        backgroundColor: '#FFFFFF',
        paddingTop: HEADER_HEIGHT,
        paddingBottom: FOOTER_HEIGHT,
        paddingHorizontal: 24,
        flexDirection: 'column',
    },
    body: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    container: { flexDirection: 'row', justifyContent: 'space-between' },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: FOOTER_HEIGHT,
        padding: 24,
        color: 'rgba(68, 73, 77, 1)'
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
    table: { marginTop: 30, display: 'flex', width: '100%', paddingTop: 0, paddingBottom: 0 },
    row: {
        padding: '10px 0 5px 0',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e9ecef',
        alignItems: 'flex-start',
        lineHeight: 1
    },
    rowHeader: {
        padding: '10px 0',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 137, 0, 1)',
        alignItems: 'center',
    },
    rowFooter: {
        padding: '10px 0',
        flexDirection: 'row',
        borderTopWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(0, 137, 0, 1)',
        alignItems: 'center',
    },
    cell_1: { width: '10%' },
    cell_2: { width: '60%' },
    cell_3: { width: '15%', paddingLeft: 0 },
    cell_4: { width: '15%' },
    cell_sub1: { width: '5%' },
    cell_sub2: { width: '60%' },
    cell_sub3: { width: '15%' },
    cell_sub4: { width: '20%', paddingLeft: 0 },
    noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
    text1: { fontSize: 10 },
    text2: { fontSize: 9 },
    text4: { fontSize: 10 },
    text2Bold: { fontFamily: 'Montserrat-bold', fontSize: 9, fontWeight: 700 },
    text2Semi: { fontFamily: 'Montserrat-Semi', fontSize: 9, fontWeight: 700 },
    textBoldHeader: { fontFamily: 'Niramit-Medium', fontSize: 12, fontWeight: 700 },
    text1Medium: { fontFamily: 'Niramit-Medium', fontSize: 12 },
    text2Medium: { fontFamily: 'Niramit-Medium', fontSize: 9, fontWeight: 700 },
    text3Medium: { fontFamily: 'Niramit-Medium', fontSize: 10, fontWeight: 700 },
    text4Medium: { fontFamily: 'Niramit-Medium', fontSize: 9, fontWeight: 500 },
    textItalic: { fontFamily: 'Niramit-italic', fontSize: 10, fontWeight: 700 },
    textMontserrat: {
        fontFamily: 'Montserrat',
        fontSize: 8,
    },
    textUnderline: { textDecoration: 'underline' },
    textNiramit: {
        fontFamily: 'Niramit-Medium',
    },
    signatureBox: {
        textAlign: "center",
        height: '150px',
        width: "40%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    signatureContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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
});