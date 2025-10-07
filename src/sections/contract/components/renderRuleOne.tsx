import { View } from "@react-pdf/renderer";
import { RenderRuleName } from "../helper/renderRuleName";
import { RenderRuleNameChild } from "../helper/renderRuleNameChild";

export const renderRuleOne = () => (
    <View
        style={{
            paddingLeft: 50,
            paddingRight: 50,
            marginTop: 5,
            marginBottom: 15
        }}
    >
        <RenderRuleName first="ĐIỀU 1:" second="DANH MỤC THIẾT BỊ:" />
        <View
            style={{
                marginTop: 6
            }}
        >
            <RenderRuleNameChild sentence="1.1 Đơn hàng được mô tả như sau:" />
        </View>
    </View>
);