export const diacriticSensitiveRegex = (str: string = '') => {
    return str
        .replace(/[!@#$^&%*+=\-/{}:<>?,.\]\[\(\)|';]/g, ' ')
        .replace(
            /a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ|A|Á|À|Ã|Ả|Ạ|Ă|Ắ|Ằ|Ẵ|Ẳ|Ặ|Â|Ấ|Ầ|Ẫ|Ẩ|Ậ/g,
            '[aáàãảạăắằẵẳặâấầẫẩậAÁÀÃẢẠĂẮẰẴẲẶÂẤẦẪẨẬ]',
        )
        .replace(/i|í|ì|ĩ|ỉ|ị|I|Í|Ì|Ĩ|Ỉ|Ị/g, '[iíìĩỉịIÍÌĨỈỊ]')
        .replace(
            /e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ|E|É|È|Ẽ|Ẻ|Ẹ|Ê|Ế|Ề|Ễ|Ể|Ệ/g,
            '[eéèẽẻẹêếềễểệEÉÈẼẺẸÊẾỀỄỂỆ]',
        )
        .replace(
            /o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ|O|Ó|Ò|Õ|Ỏ|Ọ|Ô|Ố|Ồ|Ỗ|Ổ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ở|Ợ/g,
            '[oóòõỏọôốồỗổộơớờỡởợOÓÒÕỎỌÔỐỒỖỔỘƠỚỜỠỞỢ]',
        )
        .replace(
            /u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự|U|Ú|Ù|Ũ|Ủ|Ụ|Ư|Ứ|Ừ|Ữ|Ử|Ự/g,
            '[uúùũủụưứừữửựUÚÙŨỦỤƯỨỪỮỬỰ]',
        )
        .replace(/y|ý|ỳ|ỹ|ỷ|ỵ|Y|Ý|Ỳ|Ỹ|Ỷ|Ỵ/g, '[yýỳỹỷỵYÝỲỸỶỴ]')
        .replace(/ch|tr|Ch|Tr|cH|tR|CH|TR/g, '(ch|tr|Ch|Tr)')
        .replace(/k|c|K|C/g, '(k|c|K|C|t|T)')
        .replace(/d|đ|D|Đ/g, '(d|đ|D|Đ)')
        .replace(/x|s|X|S/g, '(x|s|X|S)')
        .replace(/p|b|P|B/g, '(p|b|P|B)')
        .replace(/=/g, '(bằng|Bằng)')
        .replace(/&/g, '(và|Và)')
        .replace(/\+/g, '(cộng|Cộng)')
        .replace(/-/g, '(trừ|Trừ)')
        .replace(/\//g, '(chia|Chia)')
        .replace(/%/g, '(phần trăm|Phần trăm)')
        .replace(/\*/g, '(nhân|Nhân)');
};