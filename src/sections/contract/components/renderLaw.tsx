import { Text, View } from "@react-pdf/renderer";

export const renderLaw = () => {
    const lawTexts = [
        "- Căn cứ Bộ Luật Dân sự số 91/2015/QH13 ngày 24 tháng 11 năm 2015 của Nước Cộng hòa xã hội chủ nghĩa Việt Nam;",
        "- Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/6/2005 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;",
        "- Căn cứ Luật Doanh Nghiệp Số 68/2014/QH13 ngày 26/11/2014 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;",
        "- Căn cứ vào nhu cầu và khả năng của hai Bên."
    ];
    return (
        <View style={{
            paddingLeft: 50,
            paddingRight: 50,
            marginTop: 15,
            marginBottom: 15
        }}>
            {lawTexts.map((item, index) => (
                <Text
                    key={index}
                    style={{
                        fontSize: 13,
                        fontFamily: "Niramit",
                        marginBottom: 4,
                        textIndent: 15
                    }}
                >
                    {item}
                </Text>
            ))}
        </View>
    );
}