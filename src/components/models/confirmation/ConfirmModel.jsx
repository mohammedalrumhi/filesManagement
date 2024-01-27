import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmModel({ isShow, setShow, deleteFucntion, update }) {
  return (
    <>
      <Modal
        size="lg"
        show={isShow}
        onHide={() => setLgShow(false)}
        backdrop="static"
        keyboard={false}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            تأكيد الحذف
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>هل تريد الحذف حقا؟</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              deleteFucntion();
              setShow(false);
              update();
            }}
          >
            تأكيد
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
            }}
          >
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModel;
