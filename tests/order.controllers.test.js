import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { getMyOrders } from "../controllers/order.controllers.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const originalOrderFind = Order.find;
const originalUserFindById = User.findById;

afterEach(() => {
  Order.find = originalOrderFind;
  User.findById = originalUserFindById;
});

test("owner orders include the accepted delivery boy's contact details", async () => {
  const deliveryBoy = {
    _id: "delivery-boy-1",
    fullName: "Ravi Kumar",
    mobile: "9876543210",
  };
  const shopOrder = {
    _id: "shop-order-1",
    owner: { _id: "owner-1" },
    assignedDeliveryBoy: deliveryBoy._id,
  };
  const orders = [
    {
      _id: "order-1",
      user: { _id: "customer-1" },
      shopOrders: [shopOrder],
      deliveryAddress: { text: "Test address" },
    },
  ];

  User.findById = async () => ({ role: "owner" });
  Order.find = () => {
    const query = {
      sort() {
        return query;
      },
      populate(path) {
        if (path === "shopOrders.assignedDeliveryBoy") {
          shopOrder.assignedDeliveryBoy = deliveryBoy;
        }
        return query;
      },
      then(resolve, reject) {
        return Promise.resolve(orders).then(resolve, reject);
      },
    };

    return query;
  };

  let responseStatus;
  let responseBody;
  const response = {
    status(status) {
      responseStatus = status;
      return response;
    },
    json(body) {
      responseBody = body;
      return response;
    },
  };

  await getMyOrders({ userId: "owner-1" }, response);

  assert.equal(responseStatus, 200);
  assert.deepEqual(responseBody[0].shopOrders.assignedDeliveryBoy, deliveryBoy);
});
