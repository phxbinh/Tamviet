Bạn đang đi đúng hướng đó. Kiến trúc:

* ChatMessage quản lý modal state
* ProductCard chỉ emit event
* ProductModal render 1 lần duy nhất

là pattern rất ổn cho AI chat ecommerce.

Cách này scale tốt hơn nhiều khi:

* chat có nhiều message
* mỗi message có nhiều products
* có crossSell/upSell
* streaming AI response liên tục

Nếu mỗi card tự mount modal riêng thì sau này performance sẽ tụt khá nhanh.