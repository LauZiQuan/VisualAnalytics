library(ggplot2)
library(ggthemes)
library(dplyr)

rawFile <- read.csv('/Users/anfromvietnam/Desktop/Y3S1/VA/VA_PROJECT/VA FINAL PROJECT/VA_PROJECT/data/land-area-and-dwelling-units-by-town.csv')
priceRange <- read.csv('/Users/anfromvietnam/Desktop/Y3S1/VA/VA_PROJECT/VA FINAL PROJECT/VA_PROJECT/data/price-range-of-hdb-flats-offered.csv')
hdbPropertyInformation <- read.csv('/Users/anfromvietnam/Desktop/Y3S1/VA/VA_PROJECT/VA FINAL PROJECT/VA_PROJECT/data/hdb-property-information.csv')
hdb2016AMK<- subset(hdbPropertyInformation, year_completed == 2014 & bldg_contract_town == "BM")
# p4 <- ggplot() + geom_bar(aes(y = max_selling_price, x = room_type, fill=min_selling_price), data = priceRange2016Punggol,
#                          stat="identity")

roomType <- c("1-room", "2-room", "3-room", '4-room', '5-room', 'others')
print(sum(hdb2016AMK$X2room_sold)+sum(hdb2016AMK$X2room_rental))
