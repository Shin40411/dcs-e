import { StyleSheet } from "@react-pdf/renderer";
import { useMemo } from "react";

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 80;

export const useStyles = () =>
    useMemo(
        () =>
            StyleSheet.create({
                // layout
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
                signature: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                },
                header: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT,
                    padding: 24,
                },
                footer: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: FOOTER_HEIGHT,
                    padding: 24,
                },
                container: { flexDirection: 'row', justifyContent: 'space-between' },
                containerColumn: { flexDirection: 'column', justifyContent: 'center', gap: 10 },
                containerEvenly: { flexDirection: 'row', justifyContent: 'space-evenly' },
                containerEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
                containerStart: { flexDirection: 'row', justifyContent: 'flex-start' },
                alignItemsCenter: { alignItems: "center" },
                alignItemsStart: { alignItems: "flex-start" },
                // margin
                mt80: { marginTop: 80 },
                mb4: { marginBottom: 4 },
                mb8: { marginBottom: 8 },
                mt4: { marginTop: 4 },
                mt8: { marginTop: 8 },
                mt20: { marginTop: 20 },
                mt40: { marginTop: 40 },
                mb40: { marginBottom: 40 },
                mb80: { marginBottom: 80 },
                mb100: { marginBottom: 100 },
                ml10: { marginLeft: 10 },
                // text
                h3: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
                h4: { fontSize: 12, fontWeight: 700 },
                h5: { fontSize: 10, fontWeight: 700 },
                text1: { fontSize: 10 },
                text2: { fontSize: 11 },
                text4: { fontFamily: 'Niramit-Light', fontSize: 12 },
                textBoldHeader: { fontFamily: 'Niramit-Bold', fontSize: 14, fontWeight: 700 },
                text1Bold: { fontFamily: 'Niramit-Bold' },
                text2Bold: { fontFamily: 'Niramit-SemiBold', fontSize: 12 },
                text3Bold: { fontFamily: 'Niramit-Bold', fontSize: 10, fontWeight: 700 },
                text2Semi: { fontFamily: 'Niramit-Medium', fontSize: 9, fontWeight: 700 },
                text3Semi: { fontFamily: 'Niramit-Medium', fontSize: 10, fontWeight: 700 },
                text4Semi: { fontFamily: 'Niramit-Medium', fontSize: 9, fontWeight: 500 },
                textItalic: { fontFamily: 'Niramit-italic', fontSize: 10, fontWeight: 700 },
                textUnderline: { textDecoration: 'underline' },
                textMontserrat: {
                    fontFamily: 'Montserrat',
                    fontSize: 12,
                },
                textNiramit: {
                    fontFamily: 'Niramit',
                    fontSize: 13
                },
                // table
                table: { display: 'flex', width: '100%', padding: '0 20px 0 39px' },
                row: {
                    padding: '5px 0 5px 0',
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
                cell_2: { width: '40%' },
                cell_3: { width: '15%' },
                cell_4: { width: '10%', paddingLeft: 0 },
                cell_5: { width: '15%' },
                cell_6: { width: '15%' },
                noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
            }),
        []
    );