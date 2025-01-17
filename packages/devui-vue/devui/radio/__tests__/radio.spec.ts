import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DRadio from '../src/radio'

describe('Radio', () => {
  /** 测试是否正常渲染 */
  it('radio render work', async () => {
    const onChange = jest.fn()
    const wrapper = mount({
      components: { DRadio },
      template: `<d-radio v-model="modelValue" value="A" @change="onChange">ItemA</d-radio>`,
      setup() {
        const modelValue = ref('Item1')
        return {
          modelValue,
          onChange,
        }
      },
    })

    expect(wrapper.classes()).toContain('devui-radio')
    expect(wrapper.classes()).not.toContain('active')
    expect(wrapper.text()).toEqual('ItemA')

    const input = wrapper.find('input')
    await input.trigger('change')
    expect(onChange).toBeCalledTimes(1)
  })

  /** 测试 value */
  it('radio value work', () => {
    const wrapper = mount(DRadio, {
      props: {
        value: 'Item1',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes()['value']).toEqual('Item1')
  })

  /** 测试 disabled */
  it('radio disabled work', async () => {
    const onChange = jest.fn()
    const wrapper = mount(DRadio, {
      props: {
        value: 'Item1',
        disabled: true,
        onChange,
      },
    })
    expect(wrapper.classes()).toContain('disabled')
    const input = wrapper.find('input')
    await input.trigger('change')
    expect(onChange).toBeCalledTimes(0)
  })

  /** 测试 disabled 切换 */
  it('radio disabled change', async () => {
    const onChange = jest.fn()
    const wrapper = mount(DRadio, {
      props: {
        value: 'Item1',
        disabled: true,
        onChange,
      },
    })
    expect(wrapper.classes()).toContain('disabled')
    await wrapper.setProps({
      disabled: false,
    })
    expect(wrapper.classes()).not.toContain('disabled')
  })

  /** 测试 beforeChange */
  it('radio beforeChange work', async () => {
    const beforeChange = jest.fn(() => true)
    const onChange = jest.fn()
    const wrapper = mount(DRadio, {
      props: {
        value: 'Item1',
        onChange,
        beforeChange,
      },
    })
    const input = wrapper.find('input')
    await input.trigger('change')
    expect(beforeChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)

    const beforeChangeFalse = jest.fn(() => false)
    onChange.mockReset()
    await wrapper.setProps({
      value: 'Item2',
      beforeChange: beforeChangeFalse,
      onChange,
    })
    await input.trigger('change')
    expect(beforeChangeFalse).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(0)
  })
})
