const prisma = require("../config/prismaClient");

/// USER ///

async function getCart(userId) {
    return await prisma.cart.findMany({
        where: {
            userId,
            reviewedAt: null,
            submittedAt: null
        }
    });
}

async function addItemsToCart(userId, itemId) {
    let cartItems = await prisma.cart.findMany({
        where: {
            userId,
            reviewedAt: null
        }
    });

    for (let cartItem of cartItems) {
        if(cartItem.itemId==itemId){
            if (cartItem.submittedAt == null) {
                throw new Error("Item already present in cart");
            } else {
                throw new Error("Item already requested");
            }
        }
    }

    await prisma.cart.create({
        data: {
            userId,
            itemId
        },
    });
}

async function removeItemFromCart(cartItemId) {
    await prisma.cart.delete({
        where: {
            id: cartItemId,
            isSubmitted: false
        },
    });
}

async function submitCart(userId) {
    await prisma.cart.updateMany({
        where: {
            userId,
            isSubmitted: false
        },
        data: {
            isSubmitted: true,
            submittedAt: new Date(),
        },
    });
}

async function getUserCartStatus(userId, page, limit) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const cartItems = await prisma.cart.findMany({
        where: {
            userId,
            isSubmitted: true,
        },
        select: {
            id: true,
            submittedAt: true,
            isAccepted: true,
            reviewedAt: true,
            item: {
                select: {id: true,  title: true, authors: true, dateOfIssue: true}
            }
        },
        skip,
        take: limitNum,
        orderBy: { submittedAt: "desc" }
    });

    const totalItems = await prisma.cart.count({
        where: { userId, isSubmitted: true },
    });

    const data = {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
        data: cartItems
    };

    return data;

}

/// LIBRARIAN ///

async function getRequestedItems(userId, page, limit) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum) * limitNum;

    const whereCondition = {
        isSubmitted: true,
    };

    if (userId) {
        whereCondition.userId = userId; // Filter by userId if provided
    }

    const requestedItems = await prisma.cart.findMany({
        where: whereCondition,
        include: {
            item: {
                select: {title: true, authors: true, dateOfIssue: true}
            },
            user: {
                select: {name: true, email: true}
            }
        },
        skip,
        take: limitNum,
        orderBy: { submittedAt: "desc" }
    });

    const totalItems = await prisma.cart.count({ where: whereCondition });

    const groupedByUser = requestedItems.reduce((acc, requestedItem) => {
        const { user } = requestedItem;
        if (!acc[user.id]) {
            acc[user.id] = {
                user: {
                    name: user.name,
                    email: user.email,
                },
                requestedItems: []
            };
        }

        acc[user.id].requestedItems.push({
            id: requestedItem.id,
            item: requestedItem.item,
            isAccepted: requestedItem.isAccepted,
            reviewedAt: requestedItem.reviewedAt,
            reviewedBy: requestedItem.reviewedBy,
            submittedAt: requestedItem.submittedAt,
        });

        return acc;
    }, {});

    const data = {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
        data: Object.values(groupedByUser)
    }

    return data;
}

async function reviewRequest(cartItemId, action, librarianId) {
    let toAccept = false;
    if (action == "ACCEPTED") {
        toAccept = true;
    }

    await prisma.cart.update({
        where: {
            id: cartItemId,
            reviewedAt: null
        },
        data: {
            isAccepted: toAccept,
            reviewedAt: new Date(),
            reviewedBy: librarianId
        }
    });
}

module.exports = { getCart, addItemsToCart, removeItemFromCart, submitCart, getUserCartStatus, getRequestedItems, reviewRequest };