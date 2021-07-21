import { Injectable } from '@nestjs/common';


const permissions = [
  {
    video_category: {
      displayName: 'Video category',
      permissions: [
        { name: 'video_category.update', displayName: 'Update video category'},
        { name: 'video_category.edit', displayName: 'Edit video category'},
        { name: 'video_category.create', displayName: 'Create video category'},
        { name: 'video_category.index', displayName: 'Index video category'},
        { name: 'video_category.delete', displayName: 'Delete a video category'},
      ]
    },

    video: {
      displayName: 'Video',
      permissions: [
        { name: 'video.update', displayName: 'Update video'},
        { name: 'video.edit', displayName: 'Edit video'},
        { name: 'video.create', displayName: 'Create video'},
        { name: 'video.index', displayName: 'Index video'},
        { name: 'video.delete', displayName: 'Delete a video'},
        { name: 'video.setHot', displayName: 'Set Hot for a video'},
      ]
    },

    news_category: {
      displayName: 'News category',
      permissions: [
        { name: 'news_category.update', displayName: 'Update news category'},
        { name: 'news_category.edit', displayName: 'Edit news category'},
        { name: 'news_category.create', displayName: 'Create news category'},
        { name: 'news_category.index', displayName: 'Index news category'},
        { name: 'news_category.delete', displayName: 'Delete a news category'},
      ],
    },

    news: {
      displayName: 'News',
      permissions: [
        { name: 'news.update', displayName: 'Update news'},
        { name: 'news.edit', displayName: 'Edit news'},
        { name: 'news.create', displayName: 'Create news'},
        { name: 'news.index', displayName: 'Index news'},
        { name: 'news.delete', displayName: 'Delete a news'},
        { name: 'news.setHot', displayName: 'Set Hot for a news'},
      ]
    },

    livestream_category: {
      displayName: 'Livestream category',
      permissions: [
        { name: 'livestream_category.update', displayName: 'Update livestream category'},
        { name: 'livestream_category.edit', displayName: 'Edit livestream category'},
        { name: 'livestream_category.create', displayName: 'Create livestream category'},
        { name: 'livestream_category.index', displayName: 'Index livestream category'},
        { name: 'livestream_category.delete', displayName: 'Delete a livestream category'},
      ]
    },

    livestream: {
      displayName: 'Livestream',
      permissions: [
        { name: 'livestream.edit', displayName: 'Edit livestream'},
        { name: 'livestream.index', displayName: 'Index livestream'},
        { name: 'livestream.delete', displayName: 'Delete a livestream'},
      ]
    },
   
    gift: {
      displayName: 'Gift',
      permissions: [
        { name: 'gift.edit', displayName: 'Edit gift'},
        { name: 'gift.create', displayName: 'Edit gift'},
        { name: 'gift.index', displayName: 'Index gift'},
        { name: 'gift.delete', displayName: 'Delete a gift'},
      ]
    },

    order: {
      displayName: 'Order',
      permissions: [
        { name: 'order.index', displayName: 'Index gift'},
      ]
    },

    wallet: {
      displayName: 'Wallet',
      permissions: [
        { name: 'wallet.index', displayName: 'Index wallet'},
        { name: 'wallet.delete', displayName: 'Delete a wallet'},
      ]
    },

    transaction: {
      displayName: 'Transaction',
      permissions: [
        { name: 'transaction.index', displayName: 'Index transaction'},
        { name: 'transaction.delete', displayName: 'Delete a transaction'},
      ]
    },

    member: {
      displayName: 'Member',
      permissions: [
        { name: 'member.index', displayName: 'Index Member'},
        { name: 'member.delete', displayName: 'Delete a Member'},
      ]
    },

    member_wall: {
      displayName: 'Member wall',
      permissions: [
        { name: 'member_wall.index', displayName: 'Index Member wall'},
        { name: 'member_wall.delete', displayName: 'Delete a Member wall'},
      ]
    },

    shop_category: {
      displayName: 'Shop category',
      permissions: [
        { name: 'shop_category.update', displayName: 'Update shop category'},
        { name: 'shop_category.edit', displayName: 'Edit shop category'},
        { name: 'shop_category.create', displayName: 'Create shop category'},
        { name: 'shop_category.index', displayName: 'Index shop category'},
        { name: 'shop_category.delete', displayName: 'Delete a shop category'},
      ],
    },

    shop: {
      displayName: 'Shop',
      permissions: [
        { name: 'shop.update', displayName: 'Update shop'},
        { name: 'shop.edit', displayName: 'Edit shop'},
        { name: 'shop.index', displayName: 'Index shop'},
        { name: 'shop.delete', displayName: 'Delete a shop'},
      ]
    },

  }
];

@Injectable()
export class PermissionsService {

  findAll() {
    return permissions;
  }

  findOne( key: string ) {
    return permissions[key];
  }

}
