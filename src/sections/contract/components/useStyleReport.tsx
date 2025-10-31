import { StyleSheet } from "@react-pdf/renderer";
const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 80;
export const useStylesReport = StyleSheet.create({
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 4,
        marginBottom: 8,
    },
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
    text2Bold: { fontFamily: 'Montserrat-bold', fontSize: 9, fontWeight: 700 },
    text1: { fontSize: 10 },
    text2: { fontSize: 9 },
    text4: { fontSize: 10 },
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
    textNiramit: {
        fontFamily: 'Niramit-Medium',
    },
    container: { flexDirection: 'row', justifyContent: 'space-between' },
    table: {
        marginTop: 5,
        display: 'flex',
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0
    },
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
    cell_1: { width: '5%' },
    cell_2: { width: '45%' },
    cell_3: { width: '15%', paddingLeft: 0 },
    cell_4: { width: '5%' },
    cell_5: { width: '15%' },
    cell_6: { width: '15%' },
    cell_sub1: { width: '5%' },
    cell_sub2: { width: '60%' },
    cell_sub3: { width: '15%' },
    cell_sub4: { width: '20%', paddingLeft: 0 },
    cell_sub5: { width: '20%' },
    noBorder: {
        paddingTop: '10px',
        paddingBottom: 0,
        borderBottomWidth: 0
    },
});